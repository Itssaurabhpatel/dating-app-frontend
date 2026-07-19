"use client";

import React from "react";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function FooterSection() {

  return (
    <footer className="border-t border-white/5 bg-[#06030c] py-12 px-6 backdrop-blur-md relative z-30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-white/40 font-light">
        
        {/* Col 1 */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-white font-heading">HeartSync</span>
          </div>
          <p className="text-[10px] leading-relaxed">
            Elevating matchmaking security with next-generation facial trait extraction audits. Find genuine connections safely.
          </p>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Shortcuts</h4>
          <ul className="space-y-2 text-[10px]">
            <li><a href="#" className="hover:text-rose-400 transition-colors">Home</a></li>
            <li><a href="#how-to-match" className="hover:text-rose-400 transition-colors">Match Guide</a></li>
            <li><a href="#our-users" className="hover:text-rose-400 transition-colors">Active Users</a></li>
            <li><a href="#features" className="hover:text-rose-400 transition-colors">Features Feed</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Portal Sync</h4>
          <ul className="space-y-2 text-[10px]">
            <li><Link href="/admin" className="hover:text-rose-400 transition-colors">Admin Dashboard</Link></li>
            <li><Link href="/login" className="hover:text-rose-400 transition-colors">Login Flow</Link></li>
            <li><Link href="/register" className="hover:text-rose-400 transition-colors">Register Profile</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Security Checks</h4>
          <ul className="space-y-2 text-[10px] text-emerald-400/80">
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> selfie classifier check OK</li>
            <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> stomp active gateway online</li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-white/30 font-light">
        <p>© 2026 HeartSync Matchmaking systems. All rights reserved.</p>
      </div>
    </footer>
  );
}
