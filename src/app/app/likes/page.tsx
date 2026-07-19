"use client";

import React, { useState, useEffect } from "react";
import { api, MatchResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Heart, Lock, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function LikesPage() {
  const { user, refreshUser } = useAuth();
  const [likes, setLikes] = useState<MatchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState<{ show: boolean; user?: any }>({ show: false });

  // Toggle for local demo testing
  const [premiumToggle, setPremiumToggle] = useState(user?.isPremium || false);

  const loadLikes = async () => {
    try {
      const data = await api.getLikes();
      setLikes(data);
    } catch (e) {
      console.warn("Failed to load likes list", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLikes();
  }, []);

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleApprove = async (item: MatchResponse) => {
    try {
      // Swiping LIKE on user who liked us guarantees a match!
      const response = await api.swipe(item.matchedUser.userId, "LIKE");
      toast.success(`Matched with ${item.matchedUser.name}!`);
      triggerConfetti();
      setMatchModal({ show: true, user: item.matchedUser });
      // Remove from lists
      setLikes((prev) => prev.filter((x) => x.matchId !== item.matchId));
    } catch (err) {
      toast.error("Failed to approve match.");
    }
  };

  const handlePass = (item: MatchResponse) => {
    setLikes((prev) => prev.filter((x) => x.matchId !== item.matchId));
    toast.info("Passed on recommendation.");
  };

  const handleUpgrade = () => {
    // Simulating upgrade
    if (user) {
      user.isPremium = true;
      setPremiumToggle(true);
      toast.success("Successfully upgraded to HeartSync Premium Gold! All likes unlocked.");
      refreshUser();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-8 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" /> Likes Queue
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            See profiles that swiped right on you
          </p>
        </div>

        {/* Demo Premium Switch */}
        <Button
          variant="outline"
          size="sm"
          className="text-xs self-start sm:self-auto border-primary/20 hover:border-primary/50"
          onClick={() => {
            if (user) {
              user.isPremium = !premiumToggle;
              setPremiumToggle(!premiumToggle);
              toast.info(`Simulated premium status toggled to: ${!premiumToggle}`);
            }
          }}
        >
          Simulate: {premiumToggle ? "Premium Tier (Unlocked)" : "Free Tier (Locked)"}
        </Button>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <span className="text-sm text-muted-foreground animate-pulse font-light">Loading queue...</span>
        </div>
      ) : (
        <div className="relative">
          {/* Grid Layout (will be blurred if not premium) */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-all duration-500 ${
              !premiumToggle ? "blur-md select-none pointer-events-none scale-[0.99]" : ""
            }`}
          >
            {likes.map((item) => (
              <Card
                key={item.matchId}
                className="glassmorphism-card border-none overflow-hidden rounded-2xl flex flex-col justify-between shadow-md"
              >
                <div className="aspect-[4/5] bg-zinc-900 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.matchedUser.profilePhotoUrl}
                    alt={item.matchedUser.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="text-sm font-bold truncate">
                      {item.matchedUser.name}, <span className="font-light">{item.matchedUser.age}</span>
                    </h3>
                    <p className="text-[10px] text-white/80 font-light truncate">{item.matchedUser.city}</p>
                  </div>
                </div>

                <div className="p-2.5 flex items-center gap-2">
                  <Button
                    onClick={() => handlePass(item)}
                    variant="outline"
                    className="flex-1 h-8 rounded-lg text-xs border-border hover:bg-rose-500/10 hover:border-rose-500 hover:text-rose-500"
                  >
                    Pass
                  </Button>
                  <Button
                    onClick={() => handleApprove(item)}
                    className="flex-1 h-8 bg-gradient-love text-white font-medium text-xs rounded-lg shadow-sm"
                  >
                    Match
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Paywall Overlay */}
          {!premiumToggle && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-black/20 rounded-3xl min-h-[350px]">
              <div className="glassmorphism max-w-sm p-8 rounded-3xl border-border/30 space-y-6 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[40px] pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-gradient-love flex items-center justify-center text-white mx-auto shadow-md animate-bounce">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">Unlock Your Likes</h3>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Over <span className="text-primary font-bold">{likes.length + 10} people</span> have liked you in your area! Upgrade to premium to reveal their profiles and match instantly.
                  </p>
                </div>

                {/* Plan Highlights */}
                <div className="space-y-2.5 text-left bg-muted/30 border border-border/20 rounded-2xl p-4 text-[11px] font-light text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>See who likes you instantly without swiping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span>Get 5 free Super Likes daily</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>1 Free Monthly profile boost (10x visibility)</span>
                  </div>
                </div>

                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-love text-white font-medium h-11 rounded-xl shadow-lg"
                >
                  Upgrade for $9.99/mo
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          Instant Match Celebration Overlay
      ------------------------------------------------------ */}
      <AnimatePresence>
        {matchModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6"
          >
            <div className="text-center max-w-md w-full space-y-8 select-none">
              <motion.div
                initial={{ y: -50, scale: 0.5 }}
                animate={{ y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }}
                className="flex justify-center"
              >
                <div className="bg-gradient-love text-white font-extrabold text-xs tracking-widest uppercase px-6 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/30">
                  <Sparkles className="w-4 h-4 animate-pulse" /> New Connection!
                </div>
              </motion.div>

              <h2 className="text-4xl font-black text-white leading-none">
                You matched with <br />
                <span className="text-gradient-love">{matchModal.user?.name}</span>!
              </h2>

              <div className="flex justify-center items-center gap-4 py-6 relative">
                <motion.div
                  initial={{ x: -100, rotate: -20, opacity: 0 }}
                  animate={{ x: -10, rotate: -10, opacity: 1 }}
                  className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300"
                    alt="Self"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="w-12 h-12 rounded-full bg-gradient-love flex items-center justify-center text-white absolute z-10 shadow-lg">
                  <Heart className="w-6 h-6 fill-white" />
                </div>

                <motion.div
                  initial={{ x: 100, rotate: 20, opacity: 0 }}
                  animate={{ x: 10, rotate: 10, opacity: 1 }}
                  className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0"
                >
                  <img
                    src={matchModal.user?.profilePhotoUrl}
                    alt={matchModal.user?.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
                <a href="/app/chat">
                  <Button className="w-full h-12 bg-gradient-love text-white font-medium rounded-full shadow-lg gap-2">
                    Open Chat Thread
                  </Button>
                </a>
                <Button
                  onClick={() => setMatchModal({ show: false })}
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10 h-12 rounded-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
