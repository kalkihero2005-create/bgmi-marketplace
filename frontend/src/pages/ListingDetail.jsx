import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, CaretLeft } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ListingDetail() {
  const { id } = useParams();
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [l, setL] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => { api.get(`/listings/${id}`).then(r => setL(r.data)); }, [id]);

  const handleBuy = async () => {
    try {
      await api.post("/orders", { listing_id: id });
      await refresh();
      toast.success("Funds Locked!");
      nav("/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Insufficient Balance");
    }
  };

  if (!l) return <div className="p-20 text-center font-mono text-zinc-800">CONNECTING...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      <Link to="/marketplace" className="font-mono text-[10px] text-zinc-600 hover:text-white uppercase mb-8 inline-block tracking-widest transition-all">← BACK TO MARKETPLACE</Link>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter">{l.title}</h2>
          <div className="aspect-video bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl"><img src={l.screenshots?.[0]} className="w-full h-full object-cover" /></div>
          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm"><p className="text-zinc-400 text-sm font-light leading-relaxed whitespace-pre-wrap">{l.description}</p></div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-sm">
            <div className="flex justify-between items-center mb-10"><span className="bg-[#CCFF00] text-black font-black text-[10px] px-2 py-1 uppercase">{l.tier}</span><div className="text-[#00FF66] font-mono text-[9px] uppercase border border-[#00FF66]/30 px-3 py-1 rounded-full"><ShieldCheck weight="fill" className="inline mr-1" /> ESCROW PROTECTED</div></div>
            <h1 className="font-heading text-5xl font-black text-white uppercase mb-10 leading-none tracking-tighter">{l.title}</h1>
            <div className="text-[#CCFF00] font-heading text-6xl font-black tracking-tighter mb-10">₹{l.price}</div>
            {user?.id === l.seller_id ? <div className="p-4 bg-white/5 border border-white/10 text-center font-mono text-[10px] text-zinc-500 uppercase rounded-sm tracking-widest">YOUR LISTING</div> : <button onClick={()=>setShowAgreement(true)} className="w-full bg-[#CCFF00] text-black font-black uppercase py-5 rounded-sm shadow-[0_0_30px_rgba(204,255,0,0.2)]">BUY WITH ESCROW →</button>}
          </div>
        </div>
      </div>
      {showAgreement && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md">
          <div className="max-w-xl bg-[#0a0a0a] border border-white/10 p-12 rounded-sm shadow-2xl">
            <h2 className="font-heading text-3xl font-black text-white uppercase mb-8">P2P AGREEMENT</h2>
            <div className="space-y-6 mb-12"><div className="bg-[#CCFF00]/5 border border-[#CCFF00]/20 p-5 font-mono text-white text-[11px] leading-relaxed uppercase">1. PAISA VAULT MEIN HAI: P2P DEAL KARNE PAR AAPKA PAISA TAB TAK LOCK RAHEGA JAB TAK AAP ID LOGIN NAHI KAR LETE.</div><p className="text-zinc-500 text-[11px] font-mono uppercase">2. VIDEO PROOF: ACCOUNT CHECK KARTE WAQT SCREEN RECORDING ZAROORI HAI.</p></div>
            <div className="flex items-center gap-10"><button onClick={handleBuy} className="flex-1 bg-[#CCFF00] text-black font-black py-4 uppercase text-sm rounded-sm hover:bg-[#D4FF33]">CONFIRM & PAY</button><button onClick={()=>setShowAgreement(false)} className="text-white font-bold uppercase text-xs hover:underline tracking-widest">CANCEL</button></div>
          </div>
        </div>
      )}
    </div>
  );
}