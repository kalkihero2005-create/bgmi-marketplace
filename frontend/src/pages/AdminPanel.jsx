import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, CurrencyInr, Users, Warning, CheckCircle, ArrowUUpLeft, MagnifyingGlass } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, users: 0, listings: 0, disputes: 0 });
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const s = await api.get("/admin/stats");
      const o = await api.get("/orders");
      setStats(s.data);
      setOrders(o.data);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (order_id, action) => {
    await api.post("/admin/resolve", { order_id, action });
    toast.success(`Order ${action === 'refund' ? 'Refunded' : 'Released'}`);
    load();
  };

  const filtered = orders.filter(o => o.id.includes(search) || o.listing_title.toLowerCase().includes(search.toLowerCase()));

  if (user?.role !== "admin") return <div className="p-20 text-center font-heading text-red-500">SYSTEM ACCESS DENIED</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <h1 className="font-heading text-5xl font-black text-white uppercase tracking-tighter">MISSION CONTROL</h1>
        <div className="relative w-64">
           <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
           <input className="bg-black border border-white/10 pl-10 pr-4 py-2 rounded-sm text-xs text-white outline-none w-full" placeholder="SEARCH LOGS..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12">
        <StatCard icon={CurrencyInr} label="REVENUE" value={stats.revenue} color="#CCFF00" />
        <StatCard icon={Users} label="TOTAL USERS" value={stats.users} color="#00F0FF" />
        <StatCard icon={ShieldCheck} label="ACTIVE ASSETS" value={stats.listings} color="#00FF66" />
        <StatCard icon={Warning} label="PENDING DISPUTES" value={stats.disputes} color="#FF3366" />
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden">
        <table className="w-full text-left font-mono text-[10px]">
          <thead className="bg-white/5 text-zinc-500 uppercase">
            <tr>
              <th className="p-5">Order ID</th>
              <th className="p-5">Asset</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-white/[0.02]">
                <td className="p-5 text-zinc-600">#{o.id.slice(0,8)}</td>
                <td className="p-5 text-white font-bold">{o.listing_title}</td>
                <td className="p-5 text-[#CCFF00]">{o.status}</td>
                <td className="p-5 text-right">
                  {o.status === "DISPUTED" && (
                    <div className="flex justify-end gap-2">
                      <button onClick={()=>handleAction(o.id, 'release')} className="bg-[#00FF66] text-black px-3 py-1 font-bold rounded-sm">PAY SELLER</button>
                      <button onClick={()=>handleAction(o.id, 'refund')} className="bg-[#FF3366] text-white px-3 py-1 font-bold rounded-sm">REFUND BUYER</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
      <Icon size={24} style={{color}} weight="bold" />
      <div className="text-zinc-600 text-[9px] mt-4 uppercase tracking-widest">{label}</div>
      <div className="text-white font-heading text-2xl font-black mt-1">₹{value}</div>
    </div>
  );
}