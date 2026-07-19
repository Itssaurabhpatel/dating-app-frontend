"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Clock, PhoneMissed, PhoneOutgoing, PhoneIncoming, MessageSquare, LayoutGrid, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FilterType = "all" | "video" | "audio" | "chat";
type LayoutType = "grid" | "list";

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [layout, setLayout] = useState<LayoutType>("list");
  
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.history();
        setHistory(res || []);
      } catch (e: any) {
        console.error("Failed to load history:", e);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filteredHistory = history.filter(call => filter === "all" || call.type === filter || (!call.type && filter === "chat"));

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold text-slate-900 tracking-tight"
            >
              Call History
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mt-1"
            >
              Review your recent random connections and matches.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full lg:w-auto"
          >
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200 self-start md:self-auto w-full sm:w-auto justify-center">
              <button 
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("video")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${filter === 'video' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-rose-500 hover:bg-slate-200/50'}`}
              >
                <Video className="w-4 h-4 hidden sm:block" /> Video
              </button>
              <button 
                onClick={() => setFilter("audio")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${filter === 'audio' ? 'bg-white text-indigo-500 shadow-sm' : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-200/50'}`}
              >
                <Phone className="w-4 h-4 hidden sm:block" /> Audio
              </button>
              <button 
                onClick={() => setFilter("chat")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${filter === 'chat' ? 'bg-white text-purple-500 shadow-sm' : 'text-slate-500 hover:text-purple-500 hover:bg-slate-200/50'}`}
              >
                <MessageSquare className="w-4 h-4 hidden sm:block" /> Chat
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 shrink-0">
              <button 
                onClick={() => setLayout("grid")}
                className={`p-2 rounded-full transition-all ${layout === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setLayout("list")}
                className={`p-2 rounded-full transition-all ${layout === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* History Grid/List */}
        <div className={layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[300px]'}>
          <div className={layout === 'grid' ? 'contents' : 'divide-y divide-slate-100'}>
            <AnimatePresence mode="popLayout">
              {filteredHistory.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-12 text-center text-slate-400 font-medium ${layout === 'grid' ? 'col-span-full' : ''}`}
                >
                  No history found for this category.
                </motion.div>
              ) : (
                filteredHistory.map((call, idx) => (
                  <motion.div 
                    key={call.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ delay: 0.05 * idx, duration: 0.3 }}
                    className={`group cursor-pointer transition-colors ${
                      layout === 'grid' 
                        ? 'bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-indigo-200/40 flex flex-col items-center text-center gap-4' 
                        : 'p-4 md:p-6 flex items-center justify-between hover:bg-slate-50'
                    }`}
                  >
                    <div className={`flex ${layout === 'grid' ? 'flex-col items-center gap-2 w-full' : 'items-center gap-4'}`}>
                      <div className="relative shrink-0">
                        <Avatar className={`${layout === 'grid' ? 'w-20 h-20' : 'w-12 h-12 md:w-14 md:h-14'} border-2 border-white shadow-sm`}>
                          <AvatarImage src={call.profilePhotoUrl || call.avatar} className="object-cover" />
                          <AvatarFallback>{(call.name || "U")[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                          (call.type || 'chat') === 'video' ? 'bg-rose-500' : (call.type || 'chat') === 'audio' ? 'bg-indigo-500' : 'bg-purple-500'
                        }`}>
                          {(call.type || 'chat') === 'video' && <Video className="w-3 h-3 text-white" />}
                          {(call.type || 'chat') === 'audio' && <Phone className="w-3 h-3 text-white" />}
                          {(call.type || 'chat') === 'chat' && <MessageSquare className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      
                      <div className={layout === 'grid' ? 'flex flex-col items-center w-full' : ''}>
                        <h3 className={`font-bold transition-colors ${layout === 'grid' ? 'text-lg mt-2' : 'text-sm md:text-base'} ${
                          (call.type || 'chat') === 'video' ? 'text-slate-800 group-hover:text-rose-500' : 
                          (call.type || 'chat') === 'audio' ? 'text-slate-800 group-hover:text-indigo-500' : 'text-slate-800 group-hover:text-purple-500'
                        }`}>
                          {call.name}
                        </h3>
                        <div className={`flex items-center gap-2 mt-1 ${layout === 'grid' ? 'justify-center' : ''}`}>
                          <span className={`text-xs font-medium text-slate-500`}>
                            {new Date(call.lastMessageAt || call.matchedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-4 ${layout === 'grid' ? 'mt-4 pt-4 border-t border-slate-100 w-full justify-center' : ''}`}>
                      {call.status !== 'missed' && (
                        <div className={`${layout === 'grid' ? 'flex' : 'hidden md:flex'} items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-full`}>
                          <Clock className="w-3.5 h-3.5" />
                          {call.duration}
                        </div>
                      )}
                      <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md shrink-0 ${
                        call.type === 'video' ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 
                        call.type === 'audio' ? 'bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white' :
                        'bg-purple-50 text-purple-500 hover:bg-purple-500 hover:text-white'
                      }`}>
                        {call.type === 'video' && <Video className="w-4 h-4" />}
                        {call.type === 'audio' && <Phone className="w-4 h-4" />}
                        {call.type === 'chat' && <MessageSquare className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </div>
  );
}
