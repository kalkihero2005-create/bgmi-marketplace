import React, { useEffect, useState } from "react";
import { api, TIERS } from "../lib/api";
import ListingCard from "../components/ListingCard";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [sort, setSort] = useState("newest");

  const load = async () => {
    setLoading(true);
    const params = { sort };
    if (q) params.q = q;
    if (tier && tier !== "All Tiers") params.tier = tier.toLowerCase();
    if (minP) params.min_price = minP;
    if (maxP) params.max_price = maxP;
    try {
      const { data } = await api.get("/listings", { params });
      setItems(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [tier, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#CCFF00] mb-2 font-bold">// ALL LISTINGS</div>
        <h1 className="font-heading text-5xl font-black uppercase text-white tracking-tighter">MARKETPLACE</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10 text-white font-bold uppercase text-xs tracking-widest">
              <FunnelSimple size={18} className="text-[#CCFF00]" /> FILTERS
            </div>

            <div className="space-y-6">
              <div>
                <label className="font-mono text-[9px] text-zinc-500 uppercase block mb-2 tracking-widest">SEARCH</label>
                <div className="relative">
                  <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input 
                    type="text" value={q} onChange={e=>setQ(e.target.value)}
                    placeholder="conqueror, m416..." 
                    className="w-full bg-[#121212] border border-white/5 p-3 text-xs text-white outline-none focus:border-[#CCFF00] font-mono" 
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-zinc-500 uppercase block mb-2 tracking-widest">TIER</label>
                <select value={tier} onChange={e=>setTier(e.target.value)} className="w-full bg-[#121212] border border-white/5 p-3 text-xs text-white outline-none appearance-none font-mono">
                   <option>All Tiers</option>
                   {TIERS.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[9px] text-zinc-500 uppercase block mb-2">MIN ₹</label>
                  <input type="number" value={minP} onChange={e=>setMinP(e.target.value)} className="w-full bg-[#121212] border border-white/5 p-3 text-xs text-white outline-none" />
                </div>
                <div>
                  <label className="font-mono text-[9px] text-zinc-500 uppercase block mb-2">MAX ₹</label>
                  <input type="number" value={maxP} onChange={e=>setMaxP(e.target.value)} className="w-full bg-[#121212] border border-white/5 p-3 text-xs text-white outline-none" />
                </div>
              </div>

              <div>
                <label className="font-mono text-[9px] text-zinc-500 uppercase block mb-2 tracking-widest">SORT BY</label>
                <select value={sort} onChange={e=>setSort(e.target.value)} className="w-full bg-[#121212] border border-white/5 p-3 text-xs text-white outline-none appearance-none font-mono">
                   <option value="newest">Newest</option>
                   <option value="price_asc">Price: Low to High</option>
                   <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <button onClick={load} className="w-full bg-[#CCFF00] text-black font-black uppercase py-4 text-[11px] rounded-sm shadow-[0_0_20px_rgba(204,255,0,0.15)] hover:bg-[#D4FF33] transition-all">
                APPLY FILTERS
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="font-mono text-[10px] text-zinc-600 uppercase mb-4 tracking-widest font-bold">{items.length} RESULTS</div>
          
          {loading ? (
            <div className="p-32 text-center font-mono text-zinc-800 uppercase tracking-[0.4em] animate-pulse">Syncing Vault Data...</div>
          ) : items.length === 0 ? (
            <div className="p-32 border border-white/5 rounded-sm text-center bg-black/20 flex flex-col items-center justify-center">
              <p className="font-mono text-xs text-zinc-700 uppercase tracking-[0.4em]">NO LISTINGS MATCH FILTERS.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map(l => <ListingCard key={l.id} l={l} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}