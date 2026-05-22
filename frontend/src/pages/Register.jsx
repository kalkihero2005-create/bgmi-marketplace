import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { User, Envelope, Phone, Lock, ArrowRight } from "@phosphor-icons/react";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Squad Member Registered!");
      nav("/dashboard");
    } catch (e) { toast.error("User or Phone already exists."); }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-sm shadow-2xl relative z-10">
        <h1 className="font-heading text-4xl font-black uppercase text-white mb-2">Join</h1>
        <p className="text-zinc-500 text-sm mb-8 font-mono">// Create Secure Identity</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full bg-black border border-white/10 p-4 text-white rounded-sm outline-none focus:border-[#CCFF00]" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full bg-black border border-white/10 p-4 text-white rounded-sm outline-none focus:border-[#CCFF00]" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
          <input type="tel" placeholder="Mobile Number" className="w-full bg-black border border-white/10 p-4 text-white rounded-sm outline-none focus:border-[#CCFF00]" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} required />
          <input type="password" placeholder="Create Password" className="w-full bg-black border border-white/10 p-4 text-white rounded-sm outline-none focus:border-[#CCFF00]" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
          
          <button className="w-full bg-[#CCFF00] text-black font-bold uppercase py-4 rounded-sm mt-4 hover:bg-[#D4FF33] transition-all">
            ACTIVATE ACCOUNT
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-zinc-500 font-mono">
          ALREADY IN THE HUB? <Link to="/login" className="text-[#CCFF00] underline">LOGIN</Link>
        </div>
      </div>
    </div>
  );
}