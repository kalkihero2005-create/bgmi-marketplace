import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Lock, Package, CheckCircle, CurrencyInr, CaretLeft } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [o, setO] = useState(null);
  const [credInput, setCredInput] = useState("");

  const load = async () => { try { const { data } = await api.get(`/orders/${id}`); setO(data); } catch (e) {} };
  useEffect(() => { load(); }, [id]);

  if (!o) return <div className="p-20 text-center font-mono animate-pulse text-zinc-600">SYNCING NODE...</div>;

  const steps = [
    { key: "PAYMENT_HELD", icon: Lock, label: "PAYMENT HELD" },
    { key: "DELIVERED", icon: Package, label: "ACCOUNT DELIVERED" },
    { key: "CONFIRMED", icon: CheckCircle, label: "BUYER CONFIRMED" },
    { key: "PAYOUT", icon: CurrencyInr, label: "SELLER PAID" }
  ];

  const currentIdx = steps.findIndex(s => s.key === o.status);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/dashboard" className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-10 inline-flex items-center gap-2 hover:text-white"><CaretLeft /> BACK TO DASHBOARD</Link>
      <div className="flex justify-between items-start mb-12">
        <div><div className="font-mono text-[10px] text-zinc-600 mb-1">ORDER #{o.id.slice(0, 8).toUpperCase()}</div><h1 className="font-heading text-5xl font-black text-white uppercase">{o.listing_title}</h1></div>
        <div className="text-right"><div className="font-mono text-[10px] text-zinc-600 mb-2">ORDER VALUE</div><div className="font-heading text-5xl font-black text-[#CCFF00]">₹{o.price}</div></div>
      </div>
      <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-sm mb-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-heading text-3xl font-black text-[#CCFF00] uppercase tracking-tight">{o.status.replace("_", " ")}</h2>
          <div className="bg-black border border-[#00FF66]/30 px-3 py-1 rounded-full text-[9px] text-[#00FF66] font-bold"><Lock weight="fill" className="inline mr-1" /> FUNDS LOCKED</div>
        </div>
        <div className="grid grid-cols-4 relative mb-16">
          <div className="absolute top-5 left-0 w-full h-px bg-white/5" />
          {steps.map((s, i) => (
            <div key={i} className={`flex flex-col items-center relative z-10 ${i <= currentIdx ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-12 h-12 rounded-sm border flex items-center justify-center bg-black ${i <= currentIdx ? 'border-[#CCFF00] text-[#CCFF00]' : 'border-white/10 text-zinc-500'}`}><s.icon size={22} weight="bold" /></div>
              <div className="mt-4 font-mono text-[9px] text-center uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 font-mono text-[10px]">
           <div className="text-zinc-600 uppercase font-bold mb-4">TIMELINE</div>
           <div className="flex gap-4"><span className="text-zinc-700">{new Date(o.created_at).toLocaleString()}</span><span className="text-[#CCFF00]">[{o.status}]</span><span className="text-zinc-500">Transaction secured by Vault Protocol.</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm">
           <div className="text-[10px] font-mono text-zinc-600 mb-8 uppercase font-bold tracking-widest">YOUR ACTION</div>
           {user?.id === o.seller_id && o.status === "PAYMENT_HELD" ? (
             <div className="space-y-4">
               <textarea value={credInput} onChange={e => setCredInput(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-[#CCFF00]" rows={5} placeholder="LOGIN ID & PASS..." />
               <button onClick={async () => { await api.post(`/orders/${id}/deliver`, { credentials: credInput }); load(); }} className="w-full bg-[#CCFF00] text-black font-black uppercase text-xs py-4 rounded-sm">DELIVER CREDENTIALS</button>
             </div>
           ) : <button className="text-[#FF3366] font-mono text-[10px] uppercase hover:underline font-black">ISSUE WITH TRADE? OPEN DISPUTE →</button>}
        </div>
        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm">
           <div className="text-[10px] font-mono text-zinc-600 mb-8 uppercase font-bold tracking-widest">ACCOUNT CREDENTIALS</div>
           {o.credentials && user?.id === o.buyer_id ? <div className="bg-black border border-[#CCFF00]/30 p-5 rounded-sm font-mono text-white text-sm whitespace-pre-wrap">{o.credentials}</div> : <div className="p-10 text-center font-mono text-zinc-800 text-[10px] uppercase animate-pulse tracking-[0.4em]">AWAITING SELLER...</div>}
        </div>
      </div>
    </div>
  );
}