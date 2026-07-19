"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, Check, Send, Gift, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function InvitePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Generate a mock invite link based on user ID or just a generic one
  const inviteCode = user?.id ? `HS-${user.id.substring(0, 6).toUpperCase()}` : "HS-WELCOME24";
  const inviteLink = `https://heartsync.app/join/${inviteCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on HeartSync!",
          text: "I'm using HeartSync to meet new people. Join me using my invite link!",
          url: inviteLink,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-theme(spacing.20))] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20"
          >
            <Gift className="w-10 h-10 text-rose-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight mb-4"
          >
            Invite Friends, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">
              Unlock Premium
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-md mx-auto text-lg"
          >
            For every friend that joins using your link, you both get 1 week of HeartSync Premium for free.
          </motion.p>
        </div>

        {/* Invite Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-400/10 to-indigo-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" /> Your Unique Invite Link
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-between group transition-all hover:border-rose-300">
                <span className="text-slate-600 font-medium truncate pr-4">{inviteLink}</span>
              </div>
              
              <button 
                onClick={handleCopy}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 py-4 font-bold flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-slate-900/20"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Or share via</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-2xl py-4 font-bold transition-colors"
              >
                <Share2 className="w-5 h-5" /> Share Profile
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl py-4 font-bold transition-colors"
              >
                <Send className="w-5 h-5" /> Direct Message
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats / Motivation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-8 text-slate-500 text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <span>0 Friends Joined</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-slate-400" />
            <span>0 Weeks Earned</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
