from dotenv import load_dotenv
from pathlib import Path
import os, uuid, bcrypt, jwt, datetime
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]
JWT_SECRET = os.environ['JWT_SECRET']
LISTING_FEE = 49.0

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
api = APIRouter(prefix="/api")

# --- Helpers ---
def hash_pw(pw): return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
def verify_pw(pw, hashed): return bcrypt.checkpw(pw.encode(), hashed.encode())
def create_token(user_id, email):
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=24)}, JWT_SECRET, algorithm="HS256")

async def get_user(request: Request):
    token = request.cookies.get("access_token")
    if not token: return None
    try:
        p = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return await db.users.find_one({"id": p["sub"]}, {"_id": 0, "password_hash": 0})
    except: return None

# --- Auth ---
@api.post("/auth/register")
async def register(b: dict, res: Response):
    if await db.users.find_one({"$or":[{"email":b['email'].lower()},{"phone":b['phone']}]}): raise HTTPException(400, "Exists")
    uid = str(uuid.uuid4())
    user = {"id": uid, "email": b['email'].lower(), "phone": b['phone'], "name": b['name'], "password_hash": hash_pw(b['password']), "role": "user", "wallet_balance": 0.0, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.users.insert_one(user)
    res.set_cookie("access_token", create_token(uid, b['email']), httponly=True, path="/")
    return {"id": uid, "name": b['name']}

@api.post("/auth/login")
async def login(b: dict, res: Response):
    u = await db.users.find_one({"$or": [{"email": b['identifier'].lower()}, {"phone": b['identifier']}]})
    if not u or not verify_pw(b['password'], u["password_hash"]): raise HTTPException(401)
    res.set_cookie("access_token", create_token(u["id"], u["email"]), httponly=True, path="/")
    return u

@api.get("/auth/me")
async def me(u=Depends(get_user)): 
    if not u: raise HTTPException(401)
    return u

# --- Wallet ---
@api.post("/wallet/topup")
async def topup(b: dict, u=Depends(get_user)):
    amt = float(b['amount'])
    await db.users.update_one({"id": u["id"]}, {"$inc": {"wallet_balance": amt}})
    await db.wallet_txns.insert_one({"id": str(uuid.uuid4()), "user_id": u["id"], "type": "TOPUP", "amount": amt, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"ok": True}

@api.get("/wallet/transactions")
async def get_txns(u=Depends(get_user)):
    return await db.wallet_txns.find({"user_id": u["id"]}, {"_id": 0}).sort([("created_at", -1)]).to_list(100)

# --- Listings ---
@api.get("/listings")
async def list_l(seller_id: str = None):
    q = {"status":"active"}
    if seller_id: q = {"seller_id": seller_id}
    return await db.listings.find(q,{"_id":0}).to_list(100)

@api.get("/listings/{id}")
async def get_l(id: str): return await db.listings.find_one({"id":id},{"_id":0})

@api.post("/listings")
async def create_l(b: dict, u=Depends(get_user)):
    if u['wallet_balance'] < LISTING_FEE: raise HTTPException(400, "Low Balance")
    await db.users.update_one({"id": u["id"]}, {"$inc": {"wallet_balance": -LISTING_FEE}})
    b.update({"id": str(uuid.uuid4()), "seller_id": u["id"], "status": "active", "created_at": datetime.now(timezone.utc).isoformat()})
    await db.listings.insert_one(b)
    await db.wallet_txns.insert_one({"id": str(uuid.uuid4()), "user_id": u["id"], "type": "LISTING_FEE", "amount": -LISTING_FEE, "created_at": datetime.now(timezone.utc).isoformat()})
    return b

# --- Orders & Disputes ---
@api.post("/orders")
async def create_o(b: dict, u=Depends(get_user)):
    l = await db.listings.find_one({"id": b['listing_id']})
    if u['wallet_balance'] < l['price']: raise HTTPException(400)
    await db.users.update_one({"id": u["id"]}, {"$inc": {"wallet_balance": -l['price']}})
    order = {"id": str(uuid.uuid4()), "buyer_id": u["id"], "seller_id": l["seller_id"], "price": l["price"], "listing_title": l["title"], "status": "PAYMENT_HELD", "created_at": datetime.now(timezone.utc).isoformat()}
    await db.orders.insert_one(order)
    await db.listings.update_one({"id": l["id"]}, {"$set": {"status": "sold"}})
    return order

@api.get("/orders")
async def get_orders(u=Depends(get_user)):
    if u['role'] == 'admin': return await db.orders.find({},{"_id":0}).sort([("created_at",-1)]).to_list(100)
    return await db.orders.find({"$or":[{"buyer_id":u["id"]},{"seller_id":u["id"]}]},{"_id":0}).sort([("created_at",-1)]).to_list(100)

@api.post("/orders/{id}/dispute")
async def open_dispute(id: str):
    await db.orders.update_one({"id": id}, {"$set": {"status": "DISPUTED"}})
    return {"ok": True}

# --- Admin Controls ---
@api.get("/admin/stats")
async def admin_stats(u=Depends(get_user)):
    if u['role'] != 'admin': raise HTTPException(403)
    return {
        "revenue": 5000, 
        "users": await db.users.count_documents({}), 
        "listings": await db.listings.count_documents({"status":"active"}),
        "disputes": await db.orders.count_documents({"status":"DISPUTED"})
    }

@api.post("/admin/resolve")
async def resolve(b: dict, u=Depends(get_user)):
    if u['role'] != 'admin': raise HTTPException(403)
    order = await db.orders.find_one({"id": b['order_id']})
    if b['action'] == "refund":
        await db.users.update_one({"id": order['buyer_id']}, {"$inc": {"wallet_balance": order['price']}})
        await db.orders.update_one({"id": b['order_id']}, {"$set": {"status": "REFUNDED"}})
    else:
        await db.users.update_one({"id": order['seller_id']}, {"$inc": {"wallet_balance": order['price'] * 0.92}})
        await db.orders.update_one({"id": b['order_id']}, {"$set": {"status": "PAYOUT"}})
    return {"ok": True}

app.include_router(api)