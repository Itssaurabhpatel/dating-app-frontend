"use client";

import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CustomSparkle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 4.5v4l-4 .5c-1.5.2-1.5 2.3 0 2.5l4 .5v4c.2 1.5 2.3 1.5 2.5 0v-4l4-.5c1.5-.2 1.5-2.3 0-2.5l-4-.5v-4c-.2-1.5-2.3-1.5-2.5 0z" />
    <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="6" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const CustomChat = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.846.5 3.57 1.373 5.07L2 22l4.93-1.373A9.957 9.957 0 0 0 12 22z" />
    <circle cx="8" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const CustomShield = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CustomZap = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const features = [
  { id: "01", title: "AI Sync Matching", desc: "Checks interest weights and bio semantics dynamically to compute compatibility metrics before you even swipe.", icon: CustomSparkle, color: "from-fuchsia-500 to-rose-500", iconColor: "text-rose-500" },
  { id: "02", title: "Live STOMP Sockets", desc: "Active chatting networks with immediate text delivery and typing responses. Bypass message delays completely.", icon: CustomChat, color: "from-blue-500 to-cyan-500", iconColor: "text-blue-500" },
  { id: "03", title: "Verification Pipeline", desc: "Quick selfie verification pipelines checking facial keypoints to block bots. A completely zero-catfish ecosystem.", icon: CustomShield, color: "from-emerald-400 to-teal-500", iconColor: "text-emerald-500" },
  { id: "04", title: "Smart Feeds", desc: "Our algorithm prioritizes showing active, verified users within your immediate geo-locations first.", icon: CustomZap, color: "from-amber-400 to-orange-500", iconColor: "text-amber-500" },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Sweeping highlight across the dotted grid
    gsap.to(".bg-grid-highlight", {
      maskPosition: "200% 0",
      WebkitMaskPosition: "200% 0",
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
    });

    // 2. Horizontal Pinned Scroll
    if (!scrollContainerRef.current || !sectionRef.current) return;
    
    // We get the total distance we need to slide the container left
    const getScrollAmount = () => -(scrollContainerRef.current!.scrollWidth - window.innerWidth);

    const tween = gsap.to(scrollContainerRef.current, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1, // Smooth scrubbing
        start: "top top",
        end: () => `+=${scrollContainerRef.current!.scrollWidth}`,
        invalidateOnRefresh: true, // Recalculates on resize
      }
    });

    // 3. Intro Text Fade Out
    gsap.to(".intro-text", {
      opacity: 0,
      x: -150,
      scale: 0.9,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=600",
        scrub: true,
      }
    });

    // 4. Individual Card 3D Entrance (containerAnimation)
    const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
    cards.forEach((card) => {
      gsap.from(card, {
        y: 250,
        opacity: 0,
        rotationY: 45,
        rotationX: 20,
        scale: 0.7,
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: "left 95%", // starts when left edge of card enters viewport
          end: "left 40%",   // finishes when it reaches 40% across screen
          scrub: 1,
        }
      });
    });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="features" 
      className="relative h-screen bg-white overflow-hidden text-slate-900 flex items-center"
    >
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Base Static Dotted Grid (Darker/Fainter) */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{ 
            backgroundImage: "radial-gradient(#FF617D 1.5px, transparent 1.5px)", 
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to right, black 30%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to right, black 30%, transparent 80%)"
          }}
        />

        {/* Animated Highlight Dotted Grid (Brighter wave sweeping L -> R) */}
        <div 
          className="bg-grid-highlight absolute inset-0 opacity-[0.5]"
          style={{ 
            backgroundImage: "radial-gradient(#DC0027 1.5px, transparent 1.5px)", 
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to right, transparent 0%, black 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%, transparent 100%)",
            maskSize: "200% 100%",
            WebkitMaskSize: "200% 100%",
            maskPosition: "-100% 0",
            WebkitMaskPosition: "-100% 0"
          }}
        />
        {/* Subtle grid overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Sticky Intro Text */}
      <div className="intro-text absolute left-8 md:left-24 top-32 z-10 w-[90%] md:w-[500px] pointer-events-none">
         <Badge className="bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md mb-8">
            Capabilities
         </Badge>
         <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
            Powerful<br/>Application<br/>Features
         </h2>
         <p className="text-slate-600 font-light leading-relaxed text-lg md:text-xl drop-shadow-sm">
            Everything you need to locate, verify, and chat with genuine partners. Experience a dating ecosystem built for the absolute future.
         </p>
      </div>

      {/* Horizontal Scroll Track */}
      <div 
        ref={scrollContainerRef} 
        className="flex gap-12 lg:gap-32 px-[100vw] lg:px-[50vw] items-center relative z-20 h-full w-max"
        style={{ perspective: "2000px" }}
      >
         {features.map((feat) => {
           const Icon = feat.icon;
           return (
             <div 
               key={feat.id} 
               className="feature-card shrink-0 w-[85vw] sm:w-[320px] lg:w-[380px] h-[400px] rounded-[40px] bg-white/80 border border-slate-100 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-8 flex flex-col justify-start group overflow-hidden relative cursor-default"
               style={{ transformStyle: "preserve-3d" }}
             >
               {/* Card inner glowing accent */}
               <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
               
               {/* Shimmer effect */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full transition-transform" />

               <div className="space-y-4 relative z-10">
                 <div className="transform group-hover:scale-110 transition-transform duration-500 origin-left">
                    <Icon className={`w-12 h-12 ${feat.iconColor} drop-shadow-[0_4px_15px_rgba(0,0,0,0.05)]`} />
                 </div>
                 <div>
                   <span className="text-6xl font-black text-slate-900/5 block mb-1 tracking-tighter">{feat.id}</span>
                   <h3 className="text-2xl font-bold text-slate-900 tracking-wide">{feat.title}</h3>
                 </div>
               </div>
               
               <p className="text-slate-500 font-light leading-relaxed text-base mt-4 relative z-10">
                 {feat.desc}
               </p>
             </div>
           )
         })}
      </div>
    </section>
  );
}
