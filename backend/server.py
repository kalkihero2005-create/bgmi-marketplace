from dotenv import load_dotenv
from pathlib import Path
import os, uuid, bcrypt, jwt, logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

# 1. Setup
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ.get('MONGO_URL', "mongodb://localhost:27017")
DB_NAME = os.environ.get('DB_NAME', "bgmi_marketplace")
JWT_SECRET = os.environ.get('JWT_SECRET', "a3f7c92e1b8d4a5f6e9c0d2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f")
LISTING_FEE = 49.0

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")

def hash_pw(pw: str): return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
def verify_pw(pw, hashed):
    try: return bcrypt.checkpw(pw.encode(), hashed.encode())
    except: return False

def create_token(user_id, email):
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=24)}, JWT_SECRET, algorithm="HS256")

async def get_user(request: Request):
    token = request.cookies.get("access_token")
    if not token: return None
    try:
        p = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return await db.users.find_one({"id": p["sub"]}, {"_id": 0, "password_hash": 0})
    except: return None

class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str

class LoginIn(BaseModel):
    identifier: str
    password: str

# --- REGISTRATION FIX YAHAN HAI ---
@api.post("/auth/register")
async def register(body: RegisterIn, response: Response):
    email = body.email.lower()
    
    # 1. Check specifically for Email
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, f"Email {email} is already registered. Try logging in.")
    
    # 2. Check specifically for Phone
    if await db.users.find_one({"phone": body.phone}):
        raise HTTPException(400, f"Phone number {body.phone} is already registered.")
    
    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "email": email,
        "phone": body.phone,
        "name": body.name,
        "password_hash": hash_pw(body.password),
        "role": "user",
        "wallet_balance": 0.0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(new_user)
    token = create_token(user_id, email)
    response.set_cookie("access_token", token, httponly=True, samesite="lax", path="/")
    return {"id": user_id, "name": body.name}

@api.post("/auth/login")
async def login(body: LoginIn, response: Response):
    user = await db.users.find_one({"$or": [{"email": body.identifier.lower()}, {"phone": body.identifier}]})
    if not user or not verify_pw(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid login credentials")
    token = create_token(user["id"], user["email"])
    response.set_cookie("access_token", token, httponly=True, samesite="lax", path="/")
    return {"id": user["id"], "name": user["name"], "role": user.get("role", "user"), "wallet_balance": user.get("wallet_balance", 0)}

@api.get("/auth/me")
async def me(user=Depends(get_user)):
    if not user: raise HTTPException(401)
    return user

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

@api.post("/wallet/topup")
async def topup(body: dict, user=Depends(get_user)):
    amount = float(body.get('amount', 0))
    await db.users.update_one({"id": user["id"]}, {"$inc": {"wallet_balance": amount}})
    await db.wallet_txns.insert_one({"id": str(uuid.uuid4()), "user_id": user["id"], "type": "TOPUP", "amount": amount, "created_at": datetime.now(timezone.utc).isoformat()})
    return {"ok": True}

@api.get("/wallet/transactions")
async def get_txns(user=Depends(get_user)):
    return await db.wallet_txns.find({"user_id": user["id"]}, {"_id": 0}).sort([("created_at", -1)]).to_list(100)

@api.get("/listings")
async def get_listings(seller_id: Optional[str] = None):
    q = {"status": "active"}
    if seller_id: q = {"seller_id": seller_id}
    return await db.listings.find(q, {"_id": 0}).sort([("created_at", -1)]).to_list(100)

@api.get("/listings/{id}")
async def get_listing(id: str):
    l = await db.listings.find_one({"id": id}, {"_id": 0})
    return l

@api.post("/listings")
async def create_listing(body: dict, user=Depends(get_user)):
    fresh_user = await db.users.find_one({"id": user["id"]})
    if fresh_user['wallet_balance'] < LISTING_FEE:
        raise HTTPException(400, "Insufficient Balance")
    await db.users.update_one({"id": user["id"]}, {"$inc": {"wallet_balance": -LISTING_FEE}})
    await db.wallet_txns.insert_one({"id": str(uuid.uuid4()), "user_id": user["id"], "type": "LISTING_FEE", "amount": -LISTING_FEE, "created_at": datetime.now(timezone.utc).isoformat()})
    body.update({"id": str(uuid.uuid4()), "seller_id": user["id"], "status": "active", "created_at": datetime.now(timezone.utc).isoformat()})
    await db.listings.insert_one(body)
    return body

@api.post("/orders")
async def create_order(body: dict, user=Depends(get_user)):
    l = await db.listings.find_one({"id": body['listing_id']})
    price = float(l['price'])
    fresh_user = await db.users.find_one({"id": user["id"]})
    if fresh_user['wallet_balance'] < price:
        raise HTTPException(400, "Insufficient Balance")
    await db.users.update_one({"id": user["id"]}, {"$inc": {"wallet_balance": -price}})
    order = {"id": str(uuid.uuid4()), "buyer_id": user["id"], "seller_id": l["seller_id"], "price": price, "listing_title": l["title"], "status": "PAYMENT_HELD", "created_at": datetime.now(timezone.utc).isoformat()}
    await db.orders.insert_one(order)
    await db.listings.update_one({"id": l["id"]}, {"$set": {"status": "sold"}})
    await db.wallet_txns.insert_one({"id": str(uuid.uuid4()), "user_id": user["id"], "type": "ESCROW_HOLD", "amount": -price, "created_at": datetime.now(timezone.utc).isoformat()})
    return order

@api.get("/orders")
async def my_orders(user=Depends(get_user)):
    return await db.orders.find({"$or": [{"buyer_id": user["id"]}, {"seller_id": user["id"]}]}, {"_id": 0}).sort([("created_at", -1)]).to_list(100)

@api.get("/orders/{id}")
async def get_order(id: str):
    return await db.orders.find_one({"id": id}, {"_id": 0})

@api.post("/orders/{id}/deliver")
async def deliver(id: str, body: dict):
    await db.orders.update_one({"id": id}, {"$set": {"status": "DELIVERED", "credentials": body['credentials']}})
    return {"ok": True}

@api.post("/orders/{id}/confirm")
async def confirm(id: str):
    o = await db.orders.find_one({"id": id})
    payout = float(o['price']) * 0.92
    await db.users.update_one({"id": o['seller_id']}, {"$inc": {"wallet_balance": payout}})
    await db.wallet_txns.insert_one({"id": str(uuid.uuid4()), "user_id": o['seller_id'], "type": "SALE_PAYOUT", "amount": payout, "created_at": datetime.now(timezone.utc).isoformat()})
    await db.orders.update_one({"id": id}, {"$set": {"status": "PAYOUT"}})
    return {"ok": True}

@api.get("/admin/stats")
async def admin_stats(user=Depends(get_user)):
    if user.get("role") != "admin": raise HTTPException(403)
    return {"revenue": 5000, "users": await db.users.count_documents({}), "listings": await db.listings.count_documents({"status": "active"}), "disputes": 0}

app.include_router(api)
