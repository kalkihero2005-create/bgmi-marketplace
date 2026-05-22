import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Plus, UploadSimple } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function CreateListing() {
  const { user, refresh } = useAuth();
  const nav = useNavigate();
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price: "", tier: "GOLD", level: "", kd_ratio: "", matches_played: "", bound_to: "Facebook", skins: ""
  });

  const onFile = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setShots(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const submitListing = async (e) => {
    e.preventDefault();
    if (shots.length === 0) return toast.error("Add at least 1 screenshot");
    setLoading(true);
    try {
      await api.post("/listings", {
        ...form,
        price: Number(form.price),
        level: Number(form.level),
        kd_ratio: Number(form.kd_ratio),
        matches_played: Number(form.matches_played),
        screenshots: shots,
        skins: form.skins.split(",").map(s => s.trim())
      });
      await refresh();
      toast.success("Listing live!");
      nav("/marketplace");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Error creating listing.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CCFF00] mb-2 font-bold">// NEW LISTING</div>
        <h1 className="font-heading text-5xl font-black uppercase text-white tracking-tighter">SELL YOUR ACCOUNT</h1>
        <p className="text-zinc-600 text-[10px] mt-2 uppercase font-mono tracking-widest">
          Listing fee: <span className="text-[#CCFF00]">₹49</span> · Platform commission on sale: <span className="text-[#CCFF00]">8%</span>
        </p>
      </div>

      <form onSubmit={submitListing} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">ACCOUNT TITLE</label>
            <input required placeholder="e.g. Conqueror Account · Mythic M416 · S30" className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00] font-mono text-sm" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">DESCRIPTION</label>
            <textarea required rows={6} className="w-full bg-[#121212] border border-white/5 p-4 text-white text-sm outline-none focus:border-[#CCFF00] resize-none font-mono" placeholder="Tier, season history, skins, achievements, why you're selling..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">TIER</label>
              <select className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00] appearance-none font-mono" value={form.tier} onChange={e => setForm({...form, tier: e.target.value})}>
                <option>BRONZE</option><option>SILVER</option><option>GOLD</option><option>PLATINUM</option>
                <option>DIAMOND</option><option>CROWN</option><option>ACE</option><option>CONQUEROR</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">LEVEL</label>
              <input type="number" required className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00]" value={form.level} onChange={e => setForm({...form, level: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">K/D RATIO</label>
              <input type="number" step="0.01" required className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00]" value={form.kd_ratio} onChange={e => setForm({...form, kd_ratio: e.target.value})} />
            </div>
            <div>
              <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">MATCHES PLAYED</label>
              <input type="number" required className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00]" value={form.matches_played} onChange={e => setForm({...form, matches_played: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">BOUND TO</label>
            <select className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00] appearance-none" value={form.bound_to} onChange={e => setForm({...form, bound_to: e.target.value})}>
              <option>Facebook</option><option>Twitter</option><option>Google Play</option><option>Email</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block tracking-[0.2em] font-bold">SKINS (COMMA SEPARATED)</label>
            <input placeholder="Mythic M416, Pharaoh X-Suit..." className="w-full bg-[#121212] border border-white/5 p-4 text-white outline-none focus:border-[#CCFF00]" value={form.skins} onChange={e => setForm({...form, skins: e.target.value})} />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <div>
            <label className="font-mono text-[9px] uppercase text-zinc-500 mb-4 block tracking-widest font-bold">SCREENSHOTS ({shots.length})</label>
            <div className="grid grid-cols-2 gap-2">
               {shots.map((s, i) => <img key={i} src={s} className="aspect-video object-cover border border-white/10 rounded-sm" />)}
               <label className="aspect-video border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#CCFF00] transition-all bg-black/40 group">
                  <Plus size={20} className="text-zinc-700 group-hover:text-[#CCFF00]" />
                  <span className="text-[8px] text-zinc-700 font-mono mt-1">ADD</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={onFile} />
               </label>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm">
             <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block font-bold">PRICE (INR)</label>
             <input type="number" required placeholder="2500" className="w-full bg-black border border-white/5 p-4 text-white font-bold text-xl outline-none focus:border-[#CCFF00]" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
             <div className="mt-3 font-mono text-[9px] uppercase text-zinc-600 flex justify-between">
                <span>YOU RECEIVE:</span>
                <span className="text-[#CCFF00]">₹{Math.floor(form.price * 0.92) || 0} (AFTER 8% FEE)</span>
             </div>
          </div>

          <button disabled={loading} className="w-full bg-[#CCFF00] text-black font-black uppercase text-[11px] py-5 rounded-sm hover:bg-[#D4FF33] transition-all shadow-[0_0_30px_rgba(204,255,0,0.2)]">
            {loading ? "PUBLISHING..." : "PUBLISH · PAY ₹49"}
          </button>
        </div>
      </form>
    </div>
  );
}