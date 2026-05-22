import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fmtINR } from '../lib/api';
import { Lock, ArrowRight, ShieldCheck, Crosshair, CheckCircle, CurrencyInr, Lightning, Scales } from '@phosphor-icons/react';

export default function Landing() {
  const [stats, setStats] = useState({ active_listings: 0, accounts_sold: 0, total_users: 2, total_volume: 0 });

  useEffect(() => {
    api.get("/stats").then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-50 h-[1000px]"></div>
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10 pt-24 pb-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("https://static.prod-images.emergentagent.com/jobs/b3fd4b0d-39e7-48d5-beec-1212ff5f90b5/images/cfb9cec9f6cb13cd01bb1cc7dc57c103635a27281e51cbda5795873440cd523e.png")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-[#00FF66]/30 rounded-full mb-6">
              <Lock size={12} className="text-[#00FF66]" weight="fill" />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00FF66]">Escrow Protected · Zero Scam Risk</span>
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Buy & Sell<br /><span className="text-[#CCFF00]">BGMI Accounts</span><br />Without<br />
              <span className="relative inline-block">
                <span className="line-through decoration-[#FF3366] decoration-8">Getting Scammed</span>
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              India's first <span className="text-white font-semibold">peer-to-peer marketplace</span> with built-in escrow. We hold the payment, verify delivery, and protect both buyer and seller.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#CCFF00] text-black font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-[#D4FF33] transition-all shadow-[0_0_30px_rgba(204,255,0,0.25)]" to="/marketplace">
                Browse Accounts <ArrowRight weight="bold" />
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-medium uppercase tracking-wider text-sm rounded-sm hover:bg-white/5 transition" to="/sell">Sell Your Account</Link>
            </div>

            {/* Stats Grid */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              <Stat label="Active Listings" value={stats.active_listings} />
              <Stat label="Accounts Sold" value={stats.accounts_sold} />
              <Stat label="Total Users" value={stats.total_users} />
              <Stat label="Volume Traded" value={fmtINR(stats.total_volume)} />
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute -inset-10 bg-[#CCFF00]/10 blur-3xl rounded-full"></div>
            <img alt="Vault" className="relative w-full h-auto drop-shadow-[0_0_40px_rgba(0,240,255,0.3)]" src="https://static.prod-images.emergentagent.com/jobs/b3fd4b0d-39e7-48d5-beec-1212ff5f90b5/images/e9f357a25e398660aa230956c8c24f0bbe260d25a1d511b6143b6330f049d2fa.png" />
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/80 backdrop-blur border border-[#00F0FF]/40 rounded-sm font-mono text-[10px]">
              <div className="text-zinc-500 uppercase tracking-widest">Escrow Status</div>
              <div className="text-[#00F0FF] font-bold">[ FUNDS LOCKED ]</div>
            </div>
          </div>
        </div>

        {/* Marquee Strip */}
        <div className="relative border-y border-white/10 bg-black/60 py-5 overflow-hidden mt-20">
          <div className="marquee-inner font-heading font-black uppercase text-2xl text-zinc-800 tracking-tighter">
            <span>CONQUEROR ACCOUNTS • VERIFIED SELLERS • INSTANT PAYOUTS • 24/7 DISPUTE TEAM • ZERO HIDDEN FEES • 100% SAFE TRADES • </span>
            <span>CONQUEROR ACCOUNTS • VERIFIED SELLERS • INSTANT PAYOUTS • 24/7 DISPUTE TEAM • ZERO HIDDEN FEES • 100% SAFE TRADES • </span>
          </div>
        </div>
      </section>

      {/* HOW THE VAULT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#CCFF00] mb-4">// Anti-Scam Engine</div>
            <h2 className="font-heading text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight text-white">How the<br /><span className="text-[#CCFF00]">Vault</span> works</h2>
            <p className="mt-6 text-zinc-400 leading-relaxed max-w-sm">Every trade goes through a 4-stage escrow vault. Funds are locked the moment the buyer pays.</p>
            <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 text-[#CCFF00] font-mono uppercase text-xs hover:gap-3 transition-all">Full Process <ArrowRight /></Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
            <Step n="01" i={Lock} t="Payment Held" d="Buyer pays. Funds locked instantly. Seller sees a signal — not the money." />
            <Step n="02" i={Crosshair} t="Account Sent" d="Seller submits credentials. Encrypted. Visible to buyer only." />
            <Step n="03" i={CheckCircle} t="Buyer Verifies" d="Buyer logs in, checks details and confirms receipt within 24hr." />
            <Step n="04" i={CurrencyInr} t="Seller Paid" d="Funds release to seller wallet minus 8% platform fee." />
          </div>
        </div>
      </section>

      {/* WE'VE GOT BOTH SIDES COVERED */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-sm grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          <div className="relative h-64 lg:h-auto">
            <img src="https://images.pexels.com/photos/34179707/pexels-photo-34179707.jpeg" className="w-full h-full object-cover opacity-60" alt="Gamers" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
          </div>
          <div className="p-10 lg:p-16">
            <div className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-widest mb-4">// Built for India's Gamers</div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase mb-10 tracking-tighter leading-tight">We've Got<br/>Both Sides<br/><span className="text-[#CCFF00]">Covered.</span></h2>
            <div className="space-y-6">
              <Feature i={ShieldCheck} t="Buyer Protection" d="Money refunded if account doesn't match or seller ghosts." />
              <Feature i={Scales} t="Seller Protection" d="Guaranteed payout once buyer confirms — no fraud." />
              <Feature i={Lightning} t="Instant Disputes" d="Open a dispute in 1 tap. Admin team resolves within 24h." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="border-l-2 border-[#CCFF00]/40 pl-3">
    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
    <div className="font-heading text-xl sm:text-2xl font-black text-white mt-1">{value}</div>
  </div>
);

const Step = ({ n, i: Icon, t, d }) => (
  <div className="bg-[#050505] p-10 hover:bg-[#0a0a0a] transition-all group">
    <div className="flex justify-between items-start mb-8 text-zinc-700 font-mono text-xs">STEP {n} <Icon size={28} className="text-[#CCFF00] opacity-50 group-hover:opacity-100 transition" weight="bold" /></div>
    <div className="font-heading text-xl font-bold uppercase text-white mb-2 tracking-tighter">{t}</div>
    <p className="text-sm text-zinc-500">{d}</p>
  </div>
);

const Feature = ({ i: Icon, t, d }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 shrink-0 bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center rounded-sm"><Icon size={20} className="text-[#CCFF00]" weight="bold" /></div>
    <div><div className="font-bold text-white uppercase text-sm">{t}</div><div className="text-xs text-zinc-500 mt-1 leading-relaxed">{d}</div></div>
  </div>
);