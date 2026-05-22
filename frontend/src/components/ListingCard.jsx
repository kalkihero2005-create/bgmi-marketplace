import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendUp } from "@phosphor-icons/react";

export default function ListingCard({ l }) {
  // Pehli image uthao ya placeholder dalo
  const img = l.screenshots && l.screenshots.length > 0 ? l.screenshots[0] : "https://via.placeholder.com/400x400?text=No+Preview";

  return (
    <Link
      to={`/listing/${l.id}`}
      className="group block bg-[#0a0a0a] border border-white/10 hover:border-[#CCFF00]/50 transition-all duration-300 rounded-sm overflow-hidden"
    >
      {/* Top Image Section */}
      <div className="aspect-square bg-[#121212] relative overflow-hidden border-b border-white/10">
        <img 
          src={img} 
          alt={l.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Tier Badge (Left Top) */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-[#CCFF00] rounded-sm">
          <span className="font-mono text-[9px] font-black text-black uppercase">
            {l.tier || "GOLD"}
          </span>
        </div>

        {/* Verified Badge (Right Top) */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 border border-[#00FF66]/40 rounded-sm">
          <ShieldCheck size={10} weight="fill" className="text-[#00FF66]" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-[#00FF66] font-bold">VERIFIED</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-white uppercase tracking-tight truncate mb-4 group-hover:text-[#CCFF00] transition-colors">
          {l.title}
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6 border-b border-white/5 pb-4">
          <StatBox label="LEVEL" value={l.level} />
          <StatBox label="K/D" value={l.kd_ratio} />
          <StatBox label="MATCHES" value={l.matches_played} />
        </div>

        {/* Price & Status */}
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[9px] uppercase text-zinc-500 mb-1">PRICE</div>
            <div className="font-heading text-2xl font-black text-[#CCFF00]">₹{l.price}</div>
          </div>
          <div className="flex items-center gap-1 text-[#00F0FF] font-mono text-[9px] uppercase font-bold">
            <TrendUp size={12} weight="bold" /> LIVE
          </div>
        </div>
      </div>
    </Link>
  );
}

// Chhota helper component stats ke liye
function StatBox({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[9px] text-zinc-600 uppercase mb-1">{label}</div>
      <div className="text-sm font-bold text-white">{value || "0"}</div>
    </div>
  );
}