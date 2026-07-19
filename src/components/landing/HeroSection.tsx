"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Heart, Video, Phone, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Video Call");

  const handleProtectedAction = (path: string, tabName: string) => {
    setActiveTab(tabName);
    setTimeout(() => {
      if (user) {
        window.location.href = path;
      } else {
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      }
    }, 400); // Wait for the animation to play before navigating
  };

  const actionTabs = [
    { name: "Video Call", path: "/app/video" },
    { name: "Audio Call", path: "/app/audio" },
    { name: "Chat", path: "/app/chat" },
  ];
//... (The options array and the state are defined above)


  const leftGallery = [
    { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80", depth: 0.8 },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80", depth: 1.2 },
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80", depth: 0.5 },
    { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80", depth: 1.5 },
    { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80", depth: 0.9 },
    { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80", depth: 1.3 },
    { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80", depth: 0.6 },
    { url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&auto=format&fit=crop&q=80", depth: 1.1 },
  ];

  const rightGallery = [
    { url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80", depth: 1.1 },
    { url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80", depth: 0.6 },
    { url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&auto=format&fit=crop&q=80", depth: 1.4 },
    { url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80", depth: 0.8 },
    { url: "https://images.unsplash.com/photo-1534751516642-a131ffd107fd?w=300&auto=format&fit=crop&q=80", depth: 1.2 },
    { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80", depth: 0.7 },
    { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80", depth: 1.5 },
    { url: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80", depth: 0.9 },
  ];

  const leftCol1 = [...leftGallery.slice(0, 4), ...leftGallery.slice(0, 4)];
  const leftCol2 = [...leftGallery.slice(4, 8), ...leftGallery.slice(4, 8)];
  
  const rightCol1 = [...rightGallery.slice(0, 4), ...rightGallery.slice(0, 4)];
  const rightCol2 = [...rightGallery.slice(4, 8), ...rightGallery.slice(4, 8)];

  useGSAP(() => {
    // 1. Entrance Animations
    gsap.from(".hero-orb", {
      scale: 0,
      opacity: 0,
      duration: 2,
      stagger: 0.3,
      ease: "power3.out",
    });

    gsap.from(".hero-text-element", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "back.out(1.7)",
      delay: 0.5,
    });

    // 2. Continuous Floating Orbs
    gsap.to(".hero-orb", {
      y: "random(-50, 50)",
      x: "random(-50, 50)",
      duration: "random(4, 8)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5,
    });

    // 3. Infinite Vertical Scrolling
    gsap.to(".scroll-up", {
      yPercent: -50,
      ease: "none",
      duration: 30,
      repeat: -1,
    });
    
    gsap.fromTo(".scroll-down", {
      yPercent: -50
    }, {
      yPercent: 0,
      ease: "none",
      duration: 30, // Make duration match scroll-up for symmetry
      repeat: -1,
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden bg-white border-b border-slate-100"
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb absolute top-[10%] left-[20%] w-96 h-96 bg-rose-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="hero-orb absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="hero-orb absolute bottom-[-10%] left-[40%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      {/* Left Gallery (Vertical Infinite Scroll) */}
      <div className="absolute inset-y-0 left-6 w-[28%] pointer-events-none hidden xl:flex items-center justify-center gap-6 z-10 opacity-70">
        <div className="flex flex-col gap-6 scroll-up h-max">
          {leftCol1.map((pic, i) => (
            <div
              key={`left-col1-${i}`}
              className="gallery-item pointer-events-auto rounded-[5px] hover:shadow-[0_20px_50px_-10px_rgba(225,29,72,0.4)] hover:z-50 transition-shadow duration-300 cursor-crosshair"
            >
              <img src={pic.url} alt="User" className="w-[110px] h-[140px] object-cover rounded-[5px] hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6 scroll-down h-max">
          {leftCol2.map((pic, i) => (
            <div
              key={`left-col2-${i}`}
              className="gallery-item pointer-events-auto rounded-[5px] hover:shadow-[0_20px_50px_-10px_rgba(225,29,72,0.4)] hover:z-50 transition-shadow duration-300 cursor-crosshair"
            >
              <img src={pic.url} alt="User" className="w-[110px] h-[140px] object-cover rounded-[5px] hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Gallery (Vertical Infinite Scroll) */}
      <div className="absolute inset-y-0 right-6 w-[28%] pointer-events-none hidden xl:flex items-center justify-center gap-6 z-10 opacity-70">
        <div className="flex flex-col gap-6 scroll-up h-max">
          {rightCol1.map((pic, i) => (
            <div
              key={`right-col1-${i}`}
              className="gallery-item pointer-events-auto rounded-[5px] hover:shadow-[0_20px_50px_-10px_rgba(225,29,72,0.4)] hover:z-50 transition-shadow duration-300 cursor-crosshair"
            >
              <img src={pic.url} alt="User" className="w-[110px] h-[140px] object-cover rounded-[5px] hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6 scroll-down h-max">
          {rightCol2.map((pic, i) => (
            <div
              key={`right-col2-${i}`}
              className="gallery-item pointer-events-auto rounded-[5px] hover:shadow-[0_20px_50px_-10px_rgba(225,29,72,0.4)] hover:z-50 transition-shadow duration-300 cursor-crosshair"
            >
              <img src={pic.url} alt="User" className="w-[110px] h-[140px] object-cover rounded-[5px] hover:scale-110 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* White Fade Shadow from Center */}
      <div className="absolute inset-0 pointer-events-none z-15 flex justify-center items-center">
        <div className="w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_15%,_rgba(255,255,255,0.7)_40%,_transparent_75%)]" />
      </div>

      {/* Center Main Content */}
      <div ref={titleRef} className="w-full max-w-2xl flex flex-col items-center justify-center space-y-12 z-20 px-4 text-center pointer-events-none">
        <div className="space-y-6">
          <div className="hero-text-element flex items-center justify-center gap-2 mb-4">
            <span className="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
              <Heart className="w-3 h-3 fill-rose-500 animate-pulse" /> The New Standard
            </span>
          </div>
          
          <h1 className="hero-text-element font-script text-[#ea384d] text-8xl md:text-9xl font-normal tracking-tight drop-shadow-sm select-none">
            HeartSync
          </h1>

          <h2 className="hero-text-element text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase max-w-xl mx-auto drop-shadow-sm">
            Strangers Today, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 drop-shadow-sm">
              Connected Now.
            </span>
          </h2>
          
          <p className="hero-text-element text-lg text-slate-600 max-w-md mx-auto leading-relaxed drop-shadow-sm">
            Experience personality-first AI compatibility matches and real-time chat syncs instantly. Skip the endless swiping.
          </p>
        </div>

        <div className="hero-text-element cta-btn-wrapper flex flex-col items-center gap-4 w-full max-w-[420px] pointer-events-auto mt-8">
          <div className="flex items-center w-full bg-slate-50/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/60 shadow-[0_8px_20px_-12px_rgba(0,0,0,0.1)] relative">
            
            {/* The sliding black background */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(33.333%-4px)] bg-[#111111] rounded-full shadow-md z-0"
              initial={false}
              animate={{ 
                x: activeTab === 'Video Call' ? '0%' : 
                   activeTab === 'Audio Call' ? '100%' : '200%' 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />

            {actionTabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => handleProtectedAction(tab.path, tab.name)}
                  className={`flex-1 px-4 py-3 rounded-full font-semibold text-sm tracking-wide transition-colors relative z-10 ${
                    isActive ? "text-white" : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Secure • Private • Instant Connection
          </span>
        </div>
      </div>
    </section>
  );
}
