"use client";

import React, { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password
      });

      if (response && response.data && response.data.accessToken) {
        const token = response.data.accessToken;
        
        localStorage.setItem("auth_token", token);
        const userRes = await api.get("/auth/me");
        
        if (userRes && userRes.data) {
          login(token, userRes.data);
          toast.success("Successfully logged in!");
          router.push(redirectUrl);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to log in.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Background Decor (Subtle lines/shapes) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] border-[1px] border-slate-200 rounded-full opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] border-[1px] border-slate-200 rounded-full opacity-50" />
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-[900px] bg-white rounded-[24px] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[550px]">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            {/* Fix 1: Removed the dot behind Log In */}
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight mb-2">
              Log In
            </h1>
            <p className="text-sm text-slate-400 font-medium">Welcome back! Please enter your details</p>
          </div>

          {/* Fix 2: Reduced the size of form (max-w-[320px] and smaller gaps) */}
          <form onSubmit={handleEmailSubmit} className="w-full max-w-[320px] mx-auto space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-slate-700 text-xs font-bold ml-1">Email</label>
              <input
                id="email"
                type="email"
                required
                className="w-full h-[42px] rounded-xl bg-slate-100/80 border-transparent focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors text-sm px-4 shadow-inner text-slate-800 placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-slate-700 text-xs font-bold ml-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  /* Fix 3: View password icon works now by toggling type */
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-[42px] rounded-xl bg-slate-100/80 border-transparent focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors text-sm px-4 pr-10 shadow-inner text-slate-800 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Fix 5: Color matching (changed to rose-500) */}
            <div className="flex justify-start pt-1">
              <a href="#" className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors ml-1">
                forgot password ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-[42px] rounded-xl transition-all shadow-md hover:shadow-lg mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] uppercase font-bold tracking-widest">Or Continue With</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Fix 4: Only one button (Google) */}
            <div className="flex justify-center">
              <button 
                type="button" 
                className="w-full h-[42px] rounded-xl bg-slate-100/80 border border-transparent hover:bg-slate-200 hover:border-slate-300 font-bold text-slate-700 text-xs flex items-center justify-center gap-2 transition-all shadow-inner"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400 font-medium">Don't have account? </span>
              <Link href="/register" className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors">
                Sign up
              </Link>
            </div>
          </form>
        </div>

        {/* Right Side: Image Cover */}
        <div className="hidden md:block w-1/2 relative bg-slate-900 overflow-hidden">
          {/* We use a beautiful romantic sunset image to fit the dating app theme, matching the style of the user's screenshot layout */}
          <img 
            src="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1000&auto=format&fit=crop" 
            alt="HeartSync Background" 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-rose-900/10 mix-blend-overlay"></div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}