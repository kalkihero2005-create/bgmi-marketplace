import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Crosshair, Wallet, DotsThreeVertical, Headset, SignOut, UserCircle, ShieldCheck } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const nav = useNavigate();

  const handleLogout = async () => {
    setIsExiting(true);
    setTimeout(async () => {
      await logout();
      setIsExiting(false);
      nav("/");
    }, 1000);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-black/80 backdrop-blur-xl border-b border-white/10 h-20 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo Logic: Redirect to Dashboard if logged in */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 active:scale-95 transition-transform">
            <Crosshair size={32} weight="bold" className="text-[#CCFF00]" />
            <div className="leading-none text-left">
              <div className="font-heading font-black text-xl text-white uppercase tracking-tighter">BGMI.HUB</div>
              <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-500 uppercase mt-0.5 font-bold">ESCROW PROTECTED</div>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm font-mono text-xs text-[#CCFF00]">
                  <Wallet size={16} weight="bold" /> ₹{user.wallet_balance}
                </div>
                
                <div className="relative">
                  <button onClick={() => setMenu(!menu)} className="p-2 text-white hover:bg-white/10 rounded-full transition-all">
                    <DotsThreeVertical size={32} weight="bold" />
                  </button>

                  <AnimatePresence>
                    {menu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 bg-[#0a0a0a] border border-white/10 shadow-2xl rounded-sm py-2 z-[110]" 
                        onMouseLeave={() => setMenu(false)}
                      >
                        <div className="px-4 py-4 border-b border-white/10 mb-2">
                          <p className="text-white font-black text-sm uppercase truncate">{user.name}</p>
                          <p className="text-[#CCFF00] text-[9px] uppercase font-mono mt-1 font-bold">{user.role}</p>
                        </div>
                        
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase text-zinc-300 hover:bg-[#CCFF00] hover:text-black transition-all">
                          <UserCircle size={20} weight="bold" /> My Profile
                        </Link>

                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black transition-all">
                            <ShieldCheck size={20} weight="bold" /> Mission Control
                          </Link>
                        )}

                        <button onClick={() => window.open('https://t.me/admin_help', '_blank')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase text-zinc-300 hover:bg-[#CCFF00] hover:text-black transition-all text-left font-sans">
                          <Headset size={20} weight="bold" /> Support
                        </button>

                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase text-[#FF3366] hover:bg-[#FF3366] hover:text-white transition-all text-left border-t border-white/5 mt-2 pt-4 font-sans">
                          <SignOut size={20} weight="bold" /> Terminate Session
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-white font-bold uppercase text-[10px] px-4 py-2 hover:text-[#CCFF00]">Login</Link>
                <Link to="/register" className="bg-[#CCFF00] text-black font-black uppercase text-[10px] px-6 py-2.5 rounded-sm hover:bg-[#D4FF33]">Join Squad</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Overlay Animation */}
      <AnimatePresence>
        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-1 bg-[#FF3366] animate-pulse mb-4" />
            <div className="font-heading text-xl font-black text-white uppercase tracking-widest">SHUTTING DOWN SYSTEM...</div>
            <div className="font-mono text-[#FF3366] text-[10px] mt-2 uppercase">Wiping Session Data</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}