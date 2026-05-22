import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Wallet, Plus, ShoppingBag, List, Receipt } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const [tab, setTab] = useState("txns");
  const [data, setData] = useState({ txns: [], orders: [], listings: [] });
  const [topupAmt, setTopupAmt] = useState(500);

  const loadData = async () => {
    if (!user) return;
    try {
      const [t, o, l] = await Promise.all([
        api.get("/wallet/transactions"),
        api.get("/orders"),
        api.get(`/listings?seller_id=${user.id}`)
      ]);
      setData({ txns: t.data, orders: o.data, listings: l.data });
    } catch (e) {}
  };

  useEffect(() => { loadData(); }, [user]);

  const handleTopup = async () => {
    try {
      await api.post("/wallet/topup", { amount: Number(topupAmt) });
      await refresh();
      loadData();
      toast.success(`₹${topupAmt} added!`);
    } catch (e) { toast.error("Failed."); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#CCFF00] mb-2 font-bold">// CONTROL ROOM</div>
        <h1 className="font-heading text-5xl font-black uppercase text-white tracking-tighter">DASHBOARD</h1>
        <p className="text-zinc-500 text-xs mt-3 uppercase font-mono tracking-widest text-white">Welcome back, <span className="font-bold">{user?.name}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#CCFF00]/10 to-transparent border border-[#CCFF00]/20 p-10 rounded-sm">
           <div className="font-mono text-[10px] text-zinc-500 mb-4 font-bold uppercase tracking-widest"><Wallet size={16} className="inline mr-2"/>WALLET BALANCE</div>
           <div className="font-heading text-7xl font-black text-white mb-10 flex items-baseline"><span className="text-4xl mr-2 text-zinc-600">₹</span>{user?.wallet_balance || 0}</div>
           <div className="flex gap-4 max-w-md relative z-10">
              <input type="number" className="bg-black border border-white/10 px-4 py-3 text-white w-24 outline-none font-mono text-sm focus:border-[#CCFF00]" value={topupAmt} onChange={e=>setTopupAmt(e.target.value)} />
              <button onClick={handleTopup} className="bg-[#CCFF00] text-black font-black uppercase text-[11px] px-8 py-3 rounded-sm hover:bg-[#D4FF33] transition-all">ADD FUNDS (TEST)</button>
           </div>
        </div>

        <div className="flex flex-col gap-4">
           <Link to="/sell" className="flex-1 bg-[#0a0a0a] border border-white/10 p-8 rounded-sm hover:border-[#CCFF00]/40 transition group">
              <Plus size={24} className="text-[#CCFF00] mb-3" weight="bold" />
              <div className="font-heading font-black text-lg text-white uppercase tracking-tight">NEW LISTING</div>
           </Link>
           <Link to="/marketplace" className="flex-1 bg-[#0a0a0a] border border-white/10 p-8 rounded-sm hover:border-[#CCFF00]/40 transition group">
              <ShoppingBag size={24} className="text-[#CCFF00] mb-3" weight="bold" />
              <div className="font-heading font-black text-lg text-white uppercase tracking-tight">BROWSE</div>
           </Link>
        </div>
      </div>

      <div className="border-b border-white/10 flex gap-2 mb-8 overflow-x-auto no-scrollbar">
         <button onClick={()=>setTab("orders")} className={`px-8 py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${tab === "orders" ? "text-[#CCFF00] border-[#CCFF00] bg-[#CCFF00]/5" : "text-zinc-600 border-transparent hover:text-white"}`}>ORDERS</button>
         <button onClick={()=>setTab("listings")} className={`px-8 py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${tab === "listings" ? "text-[#CCFF00] border-[#CCFF00] bg-[#CCFF00]/5" : "text-zinc-600 border-transparent hover:text-white"}`}>MY LISTINGS</button>
         <button onClick={()=>setTab("txns")} className={`px-8 py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${tab === "txns" ? "text-[#CCFF00] border-[#CCFF00] bg-[#CCFF00]/5" : "text-zinc-600 border-transparent hover:text-white"}`}>TRANSACTIONS</button>
      </div>

      <div className="bg-[#050505] border border-white/10 rounded-sm overflow-hidden min-h-[300px]">
         {tab === "txns" && data.txns.map(t => (
           <div key={t.id} className="p-6 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.01]">
              <div><div className="text-zinc-400 font-bold text-xs uppercase font-mono tracking-widest">{t.type}</div><div className="text-[10px] text-zinc-700 font-mono mt-1 uppercase">{new Date(t.created_at).toLocaleString()}</div></div>
              <div className={`font-heading text-xl font-black ${t.amount > 0 ? 'text-[#00FF66]' : 'text-[#FF3366]'}`}>{t.amount > 0 ? '+' : ''}{t.amount}</div>
           </div>
         ))}
         {tab === "orders" && data.orders.map(o => (
            <Link to={`/order/${o.id}`} key={o.id} className="p-6 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.01]">
               <div><div className="text-white font-bold text-sm uppercase">{o.listing_title}</div><div className="text-[10px] text-zinc-600 font-mono mt-1 uppercase">{o.status}</div></div>
               <div className="text-[#CCFF00] font-bold font-mono">₹{o.price}</div>
            </Link>
         ))}
      </div>
    </div>
  );
}