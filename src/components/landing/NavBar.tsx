import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function NavBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none flex justify-center">
      <header className="pointer-events-auto w-full max-w-7xl bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 py-3 flex items-center justify-between rounded-full transition-all duration-300">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5 select-none cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
            HeartSync
          </span>
        </div>

        {/* Links requested in Nav Bar */}
        <nav className="hidden lg:flex items-center gap-8 bg-slate-50/50 border border-slate-200/50 px-8 py-2.5 rounded-full">
          <a href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Home</a>
          <a href="#how-to-match" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Guide</a>
          <a href="#our-users" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Users</a>
          <a href="#why-us" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Why Us</a>
          <a href="#features" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Features</a>
          <a href="#feedback" className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">Feedback</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 rounded-full px-6 text-xs tracking-wider shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              Sign In
            </Button>
          </Link>
        </div>
      </header>
    </div>
  );
}
