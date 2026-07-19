"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Search, MessageSquare, LayoutGrid, List, Send, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

type ViewType = "connects" | "pendings";
type LayoutType = "grid" | "list";

export default function ConnectsPage() {
  const [view, setView] = useState<ViewType>("connects");
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [connects, setConnects] = useState<any[]>([]);
  const [pendings, setPendings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchesRes, likesRes] = await Promise.all([
        api.getMatches(),
        api.getLikes()
      ]);
      setConnects(matchesRes || []);
      setPendings(likesRes || []);
    } catch (e: any) {
      toast.error("Failed to load connections: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentList = view === "connects" ? connects : pendings;
  
  const filteredList = currentList.filter(person => 
    person.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendInvite = (name: string) => {
    toast.success(`Invitation sent to ${name}!`);
  };

  const handleAccept = async (id: string, name: string) => {
    try {
      await api.acceptLike(id);
      toast.success(`Accepted ${name}'s connection request!`);
      loadData();
    } catch (e: any) {
      toast.error("Failed to accept: " + e.message);
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await api.rejectLike(id);
      toast.info(`Rejected ${name}'s request.`);
      loadData();
    } catch (e: any) {
      toast.error("Failed to reject: " + e.message);
    }
  };

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
              Your Network
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mt-1"
            >
              Manage your connections and pending invitations.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto flex-wrap"
          >
            {/* View Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200 w-full sm:w-auto justify-center">
              <button 
                onClick={() => setView("connects")}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${view === 'connects' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50'}`}
              >
                Connects
              </button>
              <button 
                onClick={() => setView("pendings")}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${view === 'pendings' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-rose-500 hover:bg-slate-200/50'}`}
              >
                Pendings
              </button>
            </div>
            
            {/* Search */}
            <div className="w-full sm:w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all text-sm"
              />
            </div>

            {/* Layout Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200">
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

        {/* Network Grid/List */}
        <div className={`grid gap-6 min-h-[400px] ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          <AnimatePresence mode="popLayout">
            {filteredList.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400"
              >
                <Network className="w-12 h-12 mb-4 text-slate-300" />
                <p className="font-medium text-lg">No {view} found.</p>
              </motion.div>
            ) : (
              filteredList.map((person, idx) => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.05 * idx }}
                  className={`bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative group hover:shadow-2xl hover:shadow-indigo-200/40 transition-all flex ${layout === 'grid' ? 'flex-col' : 'flex-col sm:flex-row items-center gap-6'}`}
                >
                  {/* Online Indicator Dot on Card top/side */}
                  <div className={`absolute flex items-center gap-1.5 ${layout === 'grid' ? 'top-6 right-6' : 'top-6 right-6 sm:static sm:order-last sm:ml-auto'}`}>
                    <span className={`w-2 h-2 rounded-full ${
                      person.status === 'online' ? 'bg-green-500 animate-pulse' : 
                      person.status === 'busy' ? 'bg-rose-500' : 'bg-slate-300'
                    }`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{person.status || 'offline'}</span>
                  </div>

                  <div className={`flex flex-col items-center text-center ${layout === 'grid' ? 'mt-2 flex-1' : 'sm:flex-row sm:text-left sm:items-start flex-1 gap-4'}`}>
                    <Avatar className={`w-20 h-20 border-4 border-slate-50 shadow-md ${layout === 'grid' ? 'mb-4' : 'sm:mb-0 shrink-0'}`}>
                      <AvatarImage src={person.profilePhotoUrl || person.avatar} className="object-cover" />
                      <AvatarFallback>{(person.name || "U")[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg text-slate-800">{person.name}</h3>
                      <p className={`text-slate-500 text-xs mt-1 mb-2 flex items-center gap-1 ${layout === 'grid' ? 'justify-center' : 'justify-center sm:justify-start'}`}>
                        <Network className="w-3 h-3" /> {person.mutuals || 0} mutual connections
                      </p>
                      <p className="text-slate-600 text-sm line-clamp-2 italic">"{person.bio || 'Matched on ' + new Date(person.matchedAt).toLocaleDateString()}"</p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-center gap-2 pt-6 border-slate-100 ${layout === 'grid' ? 'mt-6 border-t w-full' : 'sm:pt-0 sm:border-0 sm:pl-6 sm:border-l sm:min-w-[200px]'}`}>
                    {view === "connects" ? (
                      <>
                        <button className="w-10 h-10 shrink-0 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleSendInvite(person.name)}
                          className="flex-1 min-w-[120px] py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-500 text-indigo-600 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <Send className="w-4 h-4" /> Send Invite
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleReject(person.id, person.name)}
                          className="flex-1 min-w-[90px] py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                        >
                          <UserX className="w-4 h-4" /> Reject
                        </button>
                        <button 
                          onClick={() => handleAccept(person.id, person.name)}
                          className="flex-1 min-w-[90px] py-2.5 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <UserCheck className="w-4 h-4" /> Accept
                        </button>
                      </>
                    )}
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
