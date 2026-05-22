import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Envelope, Lock, ArrowRight, ShieldCheck, Cpu } from "@phosphor-icons/react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [ident, setIdent] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(ident, pw);
      toast.success("Identity Verified. Access Granted.");
      nav("/dashboard");
    } catch (err) {
      toast.error("Access Denied. Check ID/Password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-sm shadow-2xl relative z-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CCFF00] mb-3">// Authentication</div>
          <h1 className="font-heading text-4xl font-black uppercase text-white mb-6">Login</h1>
          
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block">Email or Mobile</label>
                <div className="relative">
                  <Envelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input type="text" value={ident} onChange={e=>setIdent(e.target.value)} required className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-4 rounded-sm outline-none focus:border-[#CCFF00]" placeholder="commander@hub.com" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase text-zinc-500 mb-2 block">Secure Key</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input type="password" value={pw} onChange={e=>setPw(e.target.value)} required className="w-full bg-black border border-white/10 text-white pl-12 pr-4 py-4 rounded-sm outline-none focus:border-[#CCFF00]" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
               <Link to="/register" className="text-[10px] font-mono text-[#CCFF00] hover:underline uppercase">Create Account</Link>
               <button type="button" onClick={() => toast.info("Contact Admin on Telegram for reset.")} className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase">Forgot Password?</button>
            </div>

            <button disabled={loading} className="w-full bg-[#CCFF00] text-black font-bold uppercase py-4 rounded-sm hover:bg-[#D4FF33] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.2)]">
              {loading ? "VERIFYING..." : <>ENTER VAULT <ArrowRight weight="bold" /></>}
            </button>
          </form>
        </div>

        <div className="hidden md:block border-l border-white/10 pl-12 space-y-8">
           <div className="flex gap-4">
              <div className="p-3 bg-white/5 rounded-sm"><ShieldCheck size={24} className="text-[#00FF66]" /></div>
              <div>
                <p className="text-white font-bold text-sm uppercase">2FA Encrypted</p>
                <p className="text-zinc-500 text-xs mt-1">Your session is protected by end-to-end encryption.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="p-3 bg-white/5 rounded-sm"><Cpu size={24} className="text-[#00F0FF]" /></div>
              <div>
                <p className="text-white font-bold text-sm uppercase">P2P Node Active</p>
                <p className="text-zinc-500 text-xs mt-1">Connected to India's fastest gaming marketplace.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}