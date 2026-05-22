import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import OrderDetail from "./pages/OrderDetail";
import CreateListing from "./pages/CreateListing";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-20 min-h-screen">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/sell" element={<CreateListing />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
        <Toaster theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}