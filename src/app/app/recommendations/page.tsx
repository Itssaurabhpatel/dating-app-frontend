"use client";

import React, { useState, useEffect } from "react";
import { api, DiscoverProfile } from "@/lib/api";
import { Heart, Sparkles, MapPin, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<DiscoverProfile[]>([]);
  const [boosted, setBoosted] = useState<DiscoverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState<{ show: boolean; user?: any }>({ show: false });

  const loadData = async () => {
    try {
      const recData = await api.getRecommendations();
      const boostData = await api.getBoosted();
      setRecommendations(recData);
      setBoosted(boostData);
    } catch (err) {
      console.warn("Failed to load recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleLike = async (user: DiscoverProfile) => {
    try {
      const response = await api.swipe(user.userId, "LIKE");
      toast.success(`Liked ${user.name}!`);
      if (response.match) {
        triggerConfetti();
        setMatchModal({ show: true, user });
      }
      setRecommendations((prev) => prev.filter((p) => p.userId !== user.userId));
      setBoosted((prev) => prev.filter((p) => p.userId !== user.userId));
    } catch (e) {
      toast.error("Failed to submit request.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 select-none">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              AI Matches
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 mt-2"
            >
              Custom recommendations matching your profile semantics.
            </motion.p>
          </div>
        </div>

        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Analyzing profiles...</span>
          </div>
        ) : (
          <>
            {/* Boosted Section */}
            {boosted.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block ml-2">
                  Featured Boosted Profiles
                </span>
                <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                  {boosted.map((profile, idx) => (
                    <motion.div
                      key={profile.userId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="w-72 shrink-0 bg-white rounded-3xl overflow-hidden border border-indigo-100 relative shadow-xl shadow-indigo-100/50 group"
                    >
                      <div className="h-48 relative bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profile.profilePhotoUrl}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white text-indigo-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-indigo-600" /> Boosted
                        </div>
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {profile.compatibilityScore}% Match
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        <div className="absolute bottom-3 left-4 text-white">
                          <h3 className="text-lg font-bold">
                            {profile.name}, <span className="font-light">{profile.age}</span>
                          </h3>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" /> {profile.city}
                        </p>
                        <Button
                          onClick={() => handleLike(profile)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-md gap-2 transition-colors"
                        >
                          <Heart className="w-4 h-4 fill-white" /> Connect Now
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Core Recommendations Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 pt-4"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block ml-2">
                High Compatibility Suggestions
              </span>

              {recommendations.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl text-center text-slate-500 border border-slate-100 shadow-sm">
                  No recommendations found matching your current parameters.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendations.map((profile, idx) => (
                    <motion.div
                      key={profile.userId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="bg-white border border-slate-100 overflow-hidden rounded-3xl hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col group"
                    >
                      <div className="h-56 relative bg-slate-900 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={profile.profilePhotoUrl} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white text-slate-800 shadow-md text-xs font-bold px-3 py-1 rounded-full">
                          {profile.compatibilityScore}% Compatibility
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">
                            {profile.name}, <span className="font-light">{profile.age}</span>
                          </h3>
                          <span className="text-xs text-white/80 font-medium flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {profile.city}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 italic">
                          "{profile.bio}"
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {(profile.interests || []).slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Button
                          onClick={() => handleLike(profile)}
                          className="w-full bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white font-bold h-11 rounded-xl shadow-none hover:shadow-md mt-4 transition-all gap-2"
                        >
                          <Heart className="w-4.5 h-4.5" /> Connect
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Match Modal */}
        <AnimatePresence>
          {matchModal.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-6"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-12 text-center max-w-md w-full shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-white pointer-events-none" />
                
                <div className="relative z-10 space-y-8">
                  <motion.div initial={{ y: -20, scale: 0.8 }} animate={{ y: 0, scale: 1 }} className="flex justify-center">
                    <div className="bg-white text-rose-500 font-extrabold text-xs tracking-widest uppercase px-6 py-2 rounded-full flex items-center gap-1.5 shadow-md border border-rose-100">
                      <Sparkles className="w-4 h-4 animate-pulse" /> Match Sync!
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-black text-slate-800 leading-tight">
                    You matched with <br />
                    <span className="text-rose-500">{matchModal.user?.name}</span>!
                  </h2>

                  <div className="flex justify-center items-center gap-4 py-4 relative">
                    <motion.div
                      initial={{ x: -100, rotate: -20, opacity: 0 }}
                      animate={{ x: -10, rotate: -10, opacity: 1 }}
                      className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 z-10"
                    >
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300" alt="Self" className="w-full h-full object-cover" />
                    </motion.div>
                    <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white absolute z-20 shadow-lg border-4 border-white">
                      <Heart className="w-5 h-5 fill-white" />
                    </div>
                    <motion.div
                      initial={{ x: 100, rotate: 20, opacity: 0 }}
                      animate={{ x: 10, rotate: 10, opacity: 1 }}
                      className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 z-10"
                    >
                      <img src={matchModal.user?.profilePhotoUrl} alt={matchModal.user?.name} className="w-full h-full object-cover" />
                    </motion.div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <a href="/app/chat">
                      <Button className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/30 gap-2 text-md">
                        <MessageSquare className="w-5 h-5" /> Send a Message
                      </Button>
                    </a>
                    <Button onClick={() => setMatchModal({ show: false })} variant="ghost" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 h-12 rounded-2xl font-bold">
                      Keep Browsing
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
