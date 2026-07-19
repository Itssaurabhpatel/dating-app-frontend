"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Video, Mic, Plus, Search, Hash, LayoutGrid, List } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type LayoutType = "grid" | "list";

export default function GroupsPage() {
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    try {
      const res = await api.liveRooms.list();
      setGroups(res || []);
    } catch (e: any) {
      toast.error("Failed to load rooms: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleJoin = async (id: string) => {
    try {
      await api.liveRooms.join(id);
      toast.success("Joined room!");
      loadRooms();
    } catch (e: any) {
      toast.error("Failed to join room: " + e.message);
    }
  };

  const handleCreate = async () => {
    try {
      await api.liveRooms.create({
        name: "New Room",
        description: "Come hang out!",
        type: "video",
        maxParticipants: 10,
        bgImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
        tags: ["Chill"]
      });
      toast.success("Room created!");
      loadRooms();
    } catch (e: any) {
      toast.error("Failed to create room: " + e.message);
    }
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold text-slate-900 tracking-tight"
            >
              Live Groups
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mt-1"
            >
              Drop into live video and audio rooms to hang out with multiple people.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full md:w-auto items-center gap-3 flex-wrap sm:flex-nowrap"
          >
            <div className="relative flex-1 min-w-[200px] md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search rooms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>

            <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-4 py-2.5 font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-200 whitespace-nowrap text-sm shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              <Plus className="w-4 h-4" /> Create Room
            </button>
            
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

        {/* Groups Grid / List */}
        <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence mode="popLayout">
            {filteredGroups.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-12 text-center text-slate-400 font-medium"
              >
                No rooms found. Create one!
              </motion.div>
            ) : (
              filteredGroups.map((group, idx) => (
                <motion.div
                  key={group.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.05 * idx }}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-slate-200/60 flex ${layout === 'grid' ? 'h-64 flex-col' : 'h-auto sm:h-40 flex-col sm:flex-row bg-white'}`}
                >
                  {layout === 'grid' ? (
                    <>
                      {/* Background Image */}
                      <img src={group.bgImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop'} alt={group.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      
                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                      <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors duration-500" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className={`px-3 py-1 rounded-full backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg ${
                          group.type === 'video' ? 'bg-rose-500/80' : 'bg-indigo-500/80'
                        }`}>
                          {group.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                          {group.type === 'video' ? 'Video' : 'Audio'}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                        <Users className="w-3.5 h-3.5 text-green-400" />
                        {group.participants} / {group.maxParticipants}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 w-full p-5">
                        <h3 className="text-xl font-bold text-white tracking-tight mb-1">{group.name}</h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">{group.description}</p>
                        
                        <div className="flex items-center gap-2">
                          {(group.tags || []).map((tag: string) => (
                            <span key={tag} className="text-[10px] font-semibold text-white/90 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                              <Hash className="w-3 h-3 text-indigo-400" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover Join Overlay */}
                      <div className="absolute inset-0 bg-indigo-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <button onClick={() => handleJoin(group.id)} className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          Join Room
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="relative w-full sm:w-48 h-40 shrink-0">
                        <img src={group.bgImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop'} alt={group.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-3 left-3">
                          <div className={`px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm ${
                            group.type === 'video' ? 'bg-rose-500/90' : 'bg-indigo-500/90'
                          }`}>
                            {group.type === 'video' ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                            {group.type === 'video' ? 'Video' : 'Audio'}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-center min-w-0 bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight truncate">{group.name}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mt-1">{group.description}</p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <div className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 flex items-center gap-1.5 border border-slate-200">
                              <Users className="w-3.5 h-3.5 text-green-500" />
                              {group.participants} / {group.maxParticipants}
                            </div>
                            <button onClick={() => handleJoin(group.id)} className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-full px-4 py-1.5 font-bold text-xs transition-all shadow-sm">
                              Join
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          {(group.tags || []).map((tag: string) => (
                            <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1 border border-slate-200">
                              <Hash className="w-3 h-3 text-slate-400" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
