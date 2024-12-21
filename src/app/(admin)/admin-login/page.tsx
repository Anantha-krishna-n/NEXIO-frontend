// app/(admin)/admin-login/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { Toaster, toast } from 'sonner';
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";
import axiosInstance  from "@/app/utils/axiosInstance";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuthenticated = useAdminStore((state) => state.setAuthenticated);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(`/admin/login`, { 
        email, 
        password 
      });
      if (response.data) {
        console.log(response.data,"admin dat")
        localStorage.setItem("adminToken", response.data.token);
        setAuthenticated(true);
        toast.success("login sucessfully")
        setTimeout(()=>{
          router.push("/adminDashboard");

        },1000)
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}