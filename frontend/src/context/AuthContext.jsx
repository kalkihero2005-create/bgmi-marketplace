import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () => { try { const { data } = await api.get("/auth/me"); setUser(data); } catch { setUser(false); } setLoading(false); };
  useEffect(() => { refresh(); }, []);
  const login = async (identifier, password) => { const { data } = await api.post("/auth/login", { identifier, password }); setUser(data); return data; };
  const register = async (payload) => { const { data } = await api.post("/auth/register", payload); setUser(data); return data; };
  const logout = async () => { await api.post("/auth/logout"); setUser(false); };
  return ( <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</AuthContext.Provider> );
}
export const useAuth = () => useContext(AuthContext);