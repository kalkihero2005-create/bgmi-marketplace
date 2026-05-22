import React from "react";
import { Link } from "react-router-dom";
import { Lock, Crosshair, CheckCircle, CurrencyInr, ShieldCheck, Warning, Scales, Lightning, ArrowRight } from "@phosphor-icons/react";

export default function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="text-center mb-20 relative z-10">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-[#CCFF00] mb-4 font-bold">// ANTI-SCAM PROTOCOL</div>
        <h1 className="font-heading text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-tight">
          HOW <span className="text-[#CCFF00]">ESCROW</span> <br /> PROTECTS YOU
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-zinc-500 font-mono text-sm uppercase tracking-widest leading-relaxed">
          BGMI.HUB locks every transaction in an escrow vault. No one gets scammed. Here's the exact protocol.
        </p>
      </div>

      {/* MAIN PROTOCOL STEPS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center mb-32">
        {/* Left Shield Image */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-10 bg-[#00FF66]/10 blur-[80px] rounded-full group-hover:bg-[#00FF66]/20 transition-all duration-700" />
            <img 
              src="https://static.prod-images.emergentagent.com/jobs/b3fd4b0d-39e7-48d5-beec-1212ff5f90b5/images/17c2c4d946b357c6bc841218ada297c417a5017220ebcdd74401619b572c801c.png" 
              alt="Security Shield" 
              className="relative w-72 drop-shadow-[0_0_40px_rgba(0,255,102,0.3)]"
            />
          </div>
        </div>

        {/* Right Steps List */}
        <div className="lg:col-span-3 space-y-4">
          <ProtocolStep 
            n="01" icon={Lock} 
            t="BUYER PAYS INTO THE VAULT" 
            d="When you click 'Buy', your INR is locked in our escrow. The seller does NOT receive any money yet. They only get a notification: payment is held." 
          />
          <ProtocolStep 
            n="02" icon={Crosshair} 
            t="SELLER DELIVERS CREDENTIALS" 
            d="Seller submits the BGMI login ID + password + bound social account into the order page. Only the buyer can see these — admin never have plaintext access." 
          />
          <ProtocolStep 
            n="03" icon={CheckCircle} 
            t="BUYER VERIFIES WITHIN 24HR" 
            d="Buyer logs in to BGMI, checks tier, level, K/D, skins. Everything matches the listing? Click 'Confirm & Release'. Funds release to seller minus 8% platform fee." 
          />
          <ProtocolStep 
            n="04" icon={CurrencyInr} 
            t="SELLER PAID · BOTH REVIEW" 
            d="Money credits to seller's wallet. They can withdraw or use it to buy. Both leave reviews. Reputation builds." 
          />
        </div>
      </div>

      {/* DISPUTE SECTION */}
      <div className="mb-32">
        <h2 className="font-heading text-3xl font-black uppercase text-white text-center mb-12 tracking-tight">
          WHAT IF <span className="text-[#FF3366]">SOMETHING GOES WRONG?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DisputeCard 
            icon={Warning} 
            t="SELLER DOESN'T DELIVER" 
            d="Open a dispute. Admin reviews within 24hr. If seller is at fault, full refund to your wallet." 
          />
          <DisputeCard 
            icon={Scales} 
            t="ACCOUNT DOESN'T MATCH" 
            d="Provide proof in dispute. If admin agrees, we refund you. Seller's listing is reviewed." 
          />
          <DisputeCard 
            icon={Lightning} 
            t="BUYER GHOSTS CONFIRMATION" 
            d="Auto-release after 72hr if buyer doesn't dispute. Sellers can't be held hostage." 
          />
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="bg-gradient-to-br from-[#CCFF00]/10 to-transparent border border-[#CCFF00]/30 p-12 rounded-sm text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={120} weight="bold" /></div>
        <ShieldCheck size={48} weight="bold" className="text-[#CCFF00] mx-auto mb-6" />
        <h3 className="font-heading text-3xl font-black uppercase text-white mb-4 tracking-tighter">READY TO TRADE SAFELY?</h3>
        <p className="text-zinc-500 uppercase font-mono text-xs tracking-widest mb-10">Join thousands of Indian gamers who switched to escrow.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/marketplace" className="bg-[#CCFF00] text-black font-bold uppercase text-xs px-10 py-4 rounded-sm hover:bg-[#D4FF33] flex items-center justify-center gap-2 transition-all">
            BROWSE ACCOUNTS <ArrowRight weight="bold" />
          </Link>
          <Link to="/register" className="border border-white/20 text-white font-bold uppercase text-xs px-10 py-4 rounded-sm hover:bg-white/5 transition-all">
            CREATE FREE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProtocolStep({ n, icon: Icon, t, d }) {
  return (
    <div className="flex gap-6 bg-[#0a0a0a] border border-white/10 p-6 rounded-sm hover:border-[#CCFF00]/30 transition group">
      <div className="shrink-0 flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center rounded-sm group-hover:border-[#CCFF00]/50 transition">
          <Icon size={20} className="text-[#CCFF00]" weight="bold" />
        </div>
        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest font-bold">STEP {n}</span>
      </div>
      <div>
        <h4 className="font-heading font-black text-lg text-white uppercase mb-2 tracking-tight">{t}</h4>
        <p className="text-zinc-500 text-xs leading-relaxed font-mono uppercase tracking-tighter">{d}</p>
      </div>
    </div>
  );
}

function DisputeCard({ icon: Icon, t, d }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-sm hover:border-[#FF3366]/30 transition group">
      <Icon size={28} className="text-[#FF3366] mb-6 group-hover:scale-110 transition" weight="bold" />
      <h4 className="font-heading font-black text-sm text-white uppercase mb-3 tracking-widest">{t}</h4>
      <p className="text-zinc-600 text-xs leading-relaxed font-mono uppercase">{d}</p>
    </div>
  );
}