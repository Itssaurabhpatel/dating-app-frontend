"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScanFace, MapPin, Heart, Sparkles, ArrowUpRight, User, ShieldCheck, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Helper component for the mind-blowing typing effect
const TypewriterText = ({ text }: { text: string }) => {
  return (
    <span>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.03 + 0.2 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default function VisualMatchingGuide() {
  const [currentGender, setCurrentGender] = useState<"male" | "female">("female");
  const [animState, setAnimState] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const runSequence = (state: number) => {
      setAnimState(state);
      let nextDelay = 1000;
      switch (state) {
        case 0: nextDelay = 500; break;
        case 1: nextDelay = 1600; break; // Show step 1 (extra time for typing effect)
        case 2: nextDelay = 800; break;  // Success 1
        case 3: nextDelay = 800; break;  // Draw 1->2
        case 4: nextDelay = 1600; break; // Show step 2
        case 5: nextDelay = 800; break;  // Success 2
        case 6: nextDelay = 800; break;  // Draw 2->3
        case 7: nextDelay = 1600; break; // Show step 3
        case 8: nextDelay = 800; break;  // Success 3
        case 9: nextDelay = 800; break;  // Draw 3->1
        case 10: nextDelay = 2500; break; // Verified center
        default: break;
      }
      
      timeout = setTimeout(() => {
        runSequence((state + 1) % 11);
      }, nextDelay);
    };

    runSequence(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="how-to-match" className="relative py-32 overflow-hidden">
      
      {/* White gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/30 to-fuchsia-50/20" />
      
      {/* Animated glow blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-rose-400/[0.06] blur-[160px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-400/[0.07] blur-[140px] animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-fuchsia-400/[0.05] blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-20 select-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Badge className="bg-gradient-to-r from-rose-500/10 to-fuchsia-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-bold px-4 py-1.5 rounded-full uppercase backdrop-blur-sm">
              ✦ Visual Matching Guide
            </Badge>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-slate-900 via-rose-800 to-fuchsia-800 bg-clip-text text-transparent leading-tight tracking-tight">
            How to Get an Easy Match
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto font-light leading-relaxed">
            Three simple steps to find your perfect match through our intelligent, verification-powered framework.
          </p>
        </motion.div>

        {/* Main layout: orbital graphic + step cards */}
        <div className="relative p-10 lg:p-16 rounded-[40px] bg-white/50 border border-white/80 backdrop-blur-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden max-w-5xl mx-auto">
          {/* Inner ambient glow for the box */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/30 pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            
            {/* LEFT: 3D Orbital Graphic Sequence */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[380px] h-[380px] flex items-center justify-center shrink-0"
          >

            {/* Pulsing outer glow ring */}
            <div className="absolute w-[320px] h-[320px] rounded-full border border-rose-400/15 z-0 animate-ping" style={{ animationDuration: "3s" }} />
            
            {/* Outer ring path container */}
            <div className="absolute w-[300px] h-[300px] rounded-full z-0 flex items-center justify-center">
              {/* Background thin circle */}
              <div className="absolute w-full h-full rounded-full border border-slate-200/60 z-0" />
              
              {/* Animated Drawing Paths with Comet Heads */}
              <svg className="absolute w-[300px] h-[300px] pointer-events-none z-10 overflow-visible" style={{ transform: "rotate(-90deg)" }}>
                {/* Line 1->2 (Top to Bottom Right) */}
                <motion.circle
                  cx="150" cy="150" r="150"
                  fill="none" stroke="url(#gradient-rose)" strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: animState >= 3 ? 0.333 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
                {/* Comet Head 1->2 */}
                <motion.circle
                  cx="150" cy="150" r="150"
                  fill="none" stroke="#fff" strokeWidth="6"
                  strokeDasharray="4 942.48"
                  initial={{ strokeDashoffset: 942.48, opacity: 0 }}
                  animate={{ 
                    strokeDashoffset: animState >= 3 ? 942.48 - 314.16 : 942.48,
                    opacity: animState === 3 ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,1))" }}
                />

                {/* Line 2->3 (Bottom Right to Bottom Left) */}
                <motion.circle
                  cx="150" cy="150" r="150"
                  fill="none" stroke="url(#gradient-rose)" strokeWidth="3"
                  style={{ transformOrigin: "150px 150px", rotate: 120 }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: animState >= 6 ? 0.333 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
                {/* Comet Head 2->3 */}
                <motion.circle
                  cx="150" cy="150" r="150"
                  fill="none" stroke="#fff" strokeWidth="6"
                  strokeDasharray="4 942.48"
                  initial={{ strokeDashoffset: 942.48, opacity: 0 }}
                  animate={{ 
                    strokeDashoffset: animState >= 6 ? 942.48 - 314.16 : 942.48,
                    opacity: animState === 6 ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  strokeLinecap="round"
                  style={{ transformOrigin: "150px 150px", rotate: 120, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))" }}
                />

                {/* Line 3->1 (Bottom Left to Top) */}
                <motion.circle
                  cx="150" cy="150" r="150"
                  fill="none" stroke="url(#gradient-rose)" strokeWidth="3"
                  style={{ transformOrigin: "150px 150px", rotate: 240 }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: animState >= 9 ? 0.333 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
                {/* Comet Head 3->1 */}
                <motion.circle
                  cx="150" cy="150" r="150"
                  fill="none" stroke="#fff" strokeWidth="6"
                  strokeDasharray="4 942.48"
                  style={{ transformOrigin: "150px 150px", rotate: 240, filter: "drop-shadow(0 0 10px rgba(255,255,255,1))" }}
                  initial={{ strokeDashoffset: 942.48, opacity: 0 }}
                  animate={{ 
                    strokeDashoffset: animState >= 9 ? 942.48 - 314.16 : 942.48,
                    opacity: animState === 9 ? 1 : 0 
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
                
                <defs>
                  <linearGradient id="gradient-rose" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Step 1 Node: Top (12 o'clock) */}
              <div className="absolute pointer-events-none z-20" style={{ left: "150px", top: "0px", transform: "translate(-50%, -50%)" }}>
                <AnimatePresence>
                  {animState >= 1 && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative">
                      <div className="w-14 h-14 bg-white rounded-full border shadow-xl flex items-center justify-center text-rose-500 border-rose-200">
                        <ScanFace strokeWidth={1.5} className="w-7 h-7" />
                      </div>
                      
                      {/* Tooltip with Typing Effect */}
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-12 left-1/2 -translate-x-1/2 w-max bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[11px] font-semibold tracking-wide px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        <TypewriterText text="Step 1: Scan your face" />
                      </motion.div>

                      {/* Success Check with Sonar Ripple */}
                      <AnimatePresence>
                        {animState >= 2 && animState !== 10 && (
                          <>
                            {animState === 2 && (
                              <motion.div 
                                initial={{ scale: 1, opacity: 0.8 }} 
                                animate={{ scale: 3, opacity: 0 }} 
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 z-0" 
                              />
                            )}
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
                              <Check strokeWidth={3} className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2 Node: Bottom Right (4 o'clock) */}
              <div className="absolute pointer-events-none z-20" style={{ left: "280px", top: "225px", transform: "translate(-50%, -50%)" }}>
                <AnimatePresence>
                  {animState >= 4 && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative">
                      <div className="w-14 h-14 bg-white rounded-full border shadow-xl flex items-center justify-center text-fuchsia-500 border-fuchsia-200">
                        <MapPin strokeWidth={1.5} className="w-7 h-7" />
                      </div>
                      
                      {/* Tooltip with Typing Effect */}
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[11px] font-semibold tracking-wide px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        <TypewriterText text="Step 2: Fill Address" />
                      </motion.div>

                      {/* Success Check with Sonar Ripple */}
                      <AnimatePresence>
                        {animState >= 5 && animState !== 10 && (
                          <>
                            {animState === 5 && (
                              <motion.div 
                                initial={{ scale: 1, opacity: 0.8 }} 
                                animate={{ scale: 3, opacity: 0 }} 
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 z-0" 
                              />
                            )}
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
                              <Check strokeWidth={3} className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 3 Node: Bottom Left (8 o'clock) */}
              <div className="absolute pointer-events-none z-20" style={{ left: "20px", top: "225px", transform: "translate(-50%, -50%)" }}>
                <AnimatePresence>
                  {animState >= 7 && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="relative">
                      <div className="w-14 h-14 bg-white rounded-full border shadow-xl flex items-center justify-center text-violet-500 border-violet-200">
                        <Heart strokeWidth={1.5} className="w-7 h-7" />
                      </div>
                      
                      {/* Tooltip with Typing Effect */}
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[11px] font-semibold tracking-wide px-4 py-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        <TypewriterText text="Step 3: Add Interest" />
                      </motion.div>

                      {/* Success Check with Sonar Ripple */}
                      <AnimatePresence>
                        {animState >= 8 && animState !== 10 && (
                          <>
                            {animState === 8 && (
                              <motion.div 
                                initial={{ scale: 1, opacity: 0.8 }} 
                                animate={{ scale: 3, opacity: 0 }} 
                                transition={{ duration: 0.8, ease: "easeOut" }} 
                                className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-emerald-400 z-0" 
                              />
                            )}
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute -top-2 -left-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
                              <Check strokeWidth={3} className="w-3.5 h-3.5 text-white" />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Inner subtle ring */}
            <div className="absolute w-[220px] h-[220px] rounded-full border border-slate-200/60 z-0" />

            {/* Center profile circle */}
            <div className="relative w-40 h-40 rounded-full z-30 group cursor-pointer" onClick={() => setCurrentGender(currentGender === "female" ? "male" : "female")}>
              {/* Glow behind */}
              <div className={`absolute -inset-3 rounded-full blur-xl transition-all duration-700 opacity-70 ${animState === 10 ? 'bg-emerald-500/80 scale-110' : 'bg-gradient-to-tr from-rose-500/40 to-fuchsia-500/40'}`} />
              
              {/* Ring */}
              <div className={`absolute -inset-1 rounded-full opacity-80 transition-colors duration-500 ${animState === 10 ? 'bg-emerald-500' : 'bg-gradient-to-tr from-rose-500 to-fuchsia-500'}`} />
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 shadow-inner">
                <AnimatePresence mode="wait">
                  {animState === 10 ? (
                    <motion.div
                      key="verified"
                      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      className="absolute inset-0 flex items-center justify-center bg-emerald-500"
                    >
                      <ShieldCheck strokeWidth={2.5} className="w-20 h-20 text-white drop-shadow-md z-10" />
                      
                      {/* Particle burst (Confetti) */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={`burst-${i}`}
                          className="absolute w-2 h-2 rounded-full bg-white z-0"
                          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                          animate={{ 
                            x: Math.cos((i * 30 * Math.PI) / 180) * 80, 
                            y: Math.sin((i * 30 * Math.PI) / 180) * 80, 
                            scale: Math.random() * 0.5 + 0.5,
                            opacity: 0 
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      ))}
                    </motion.div>
                  ) : currentGender === "female" ? (
                    <motion.div
                      key="female"
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100"
                    >
                      <User strokeWidth={1.5} className="w-20 h-20 text-rose-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="male"
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100"
                    >
                      <User strokeWidth={1.5} className="w-20 h-20 text-sky-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating particles around the orbit */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-rose-400/50 pointer-events-none"
                animate={{
                  x: [0, Math.cos((i * 60 * Math.PI) / 180) * 180, 0],
                  y: [0, Math.sin((i * 60 * Math.PI) / 180) * 180, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.6, ease: "easeInOut" }}
              />
            ))}
          </motion.div>

          {/* RIGHT: Static Step Cards */}
          <div className="flex-1 space-y-5 max-w-lg w-full">
            {[
              {
                step: 1,
                icon: <ScanFace strokeWidth={1.5} className="w-7 h-7" />,
                title: "Upload Live Pic",
                desc: "Capture a quick face validation selfie during register. Purpose is to ensure gender authentication so you match easily with your target.",
              },
              {
                step: 2,
                icon: <MapPin strokeWidth={1.5} className="w-7 h-7" />,
                title: "Fill Address City or Country",
                desc: "Input target locations to index matchings nearby. Filter by cities or regions to easily coordinate physical coffee dates and sync face-to-face.",
              },
              {
                step: 3,
                icon: <Heart strokeWidth={1.5} className="w-7 h-7" />,
                title: "Add Interest",
                desc: "Select key interests and vibe metrics to sync. Our semantic match system scans matching matrices to find compatible profiles before you communicate.",
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 60, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-6 rounded-3xl transition-all duration-300 border border-slate-200/60 backdrop-blur-xl overflow-hidden bg-white hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="relative flex items-start gap-4">
                  {/* Step icon */}
                  <div className="shrink-0 w-12 h-12 flex items-center justify-center relative text-rose-500 group-hover:text-rose-600 transition-colors duration-300">
                    <span className="text-[9px] font-black absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-sm bg-rose-50 text-rose-600 border border-rose-200">
                      {item.step}
                    </span>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[15px] text-slate-900 group-hover:text-rose-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-slate-500 font-light leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
        </div>
      </div>

    </section>
  );
}
