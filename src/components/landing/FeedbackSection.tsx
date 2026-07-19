"use client";

import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function FeedbackSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const feedbackList = [
    { name: "Karan & Tanya", desc: "We computed a 98% tag score match. HeartSync is fast and verified selfies really bypass bots! The matching is insanely accurate.", stars: 5, date: "Matched May 2026", pic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", color: "bg-rose-50", border: "border-rose-100" },
    { name: "Neha & Dev", desc: "I loved that everyone was verified. It saved me from catfishes and we matched in Mumbai instantly. Highly recommend!", stars: 5, date: "Matched June 2026", pic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", color: "bg-blue-50", border: "border-blue-100" },
    { name: "Priya & Aarav", desc: "The instant WebSocket chat is extremely smooth! Truly a premium UI layout that feels like a luxury app.", stars: 5, date: "Matched April 2026", pic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100", color: "bg-emerald-50", border: "border-emerald-100" },
    { name: "Rahul & Sneha", desc: "The algorithm is crazy. We matched and felt like we've known each other for years. Best dating app ever.", stars: 5, date: "Matched Aug 2026", pic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100", color: "bg-amber-50", border: "border-amber-100" }
  ];

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".feedback-card");
    
    // Initial static styling
    gsap.set(cards, {
      y: (i) => i * 30,
      scale: (i) => 1 - (i * 0.05),
      zIndex: (i) => cards.length - i,
      transformOrigin: "top center",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // 3 full screens of scrolling
        scrub: true,
        pin: true,
      }
    });

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return; // Leave last card static

      // Fly current card UP and away
      tl.to(card, {
        y: -window.innerHeight,
        opacity: 0,
        rotation: -10,
        duration: 1,
        ease: "power2.inOut"
      }, i);

      cards.forEach((otherCard, j) => {
        if (j > i) {
          const currentTier = j - i - 1; // Next card becomes tier 0, one behind becomes tier 1, etc.
          tl.to(otherCard, {
            y: currentTier * 30,
            scale: 1 - (currentTier * 0.05),
            duration: 1,
            ease: "power2.inOut"
          }, i);
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="feedback" className="h-screen bg-slate-50 border-t border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <div className="text-center space-y-4 mb-14 relative z-20">
        <Badge className="bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
          Real Stories
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Users Feedback</h2>
        <p className="text-base text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
          Read logs from couples who met over HeartSync parameters and verified connections.
        </p>
      </div>

      <div className="relative w-full max-w-lg mx-auto h-[280px] z-10 flex justify-center perspective-[1000px]">
        {feedbackList.map((item, idx) => (
          <div 
            key={idx} 
            className={`feedback-card absolute top-0 w-[90vw] md:w-[480px] h-[250px] rounded-[28px] border ${item.border} ${item.color} shadow-xl p-8 flex flex-col justify-between`}
          >
            <div className="space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                ))}
              </div>
              <p className="text-lg text-slate-700 italic leading-relaxed font-light">
                &quot;{item.desc}&quot;
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50">
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src={item.pic} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-semibold text-slate-900 block">{item.name}</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
