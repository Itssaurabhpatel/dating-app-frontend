"use client";

import React from "react";
import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import VisualMatchingGuide from "@/components/landing/VisualMatchingGuide";
import ActiveUsersSection from "@/components/landing/ActiveUsersSection";
import WhyUsSection from "@/components/landing/WhyUsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FeedbackSection from "@/components/landing/FeedbackSection";
import FooterSection from "@/components/landing/FooterSection";

export default function HeartSyncFullLandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0612] text-white relative overflow-hidden flex flex-col font-sans select-none scroll-smooth">
      
      {/* Interactive CSS / animations properties */}
      <style jsx global>{`
        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(234,56,77,0.35)); }
          50% { filter: drop-shadow(0 0 22px rgba(234,56,77,0.65)) scale(1.01); }
        }
        .neon-logo-pulse {
          animation: logoPulse 4s ease-in-out infinite;
        }

        @keyframes shimmerGradient {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .btn-premium-shimmer {
          background: linear-gradient(90deg, #ea384d, #d20076, #ea384d);
          background-size: 200% auto;
          animation: shimmerGradient 4s linear infinite;
        }
        .btn-premium-shimmer:hover {
          box-shadow: 0 0 20px rgba(234, 56, 77, 0.4);
        }

        @keyframes linePulse {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        .connecting-svg-line {
          stroke-dasharray: 8;
          animation: linePulse 2s linear infinite;
        }
      `}</style>

      {/* Background Neon Orbs */}
      <div className="absolute top-[5%] left-[15%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <NavBar />
      
      <HeroSection />

      {/* White background container for marketing sections */}
      <div className="bg-white text-slate-900 relative z-30 w-full">
        <VisualMatchingGuide />
        <ActiveUsersSection />
        <WhyUsSection />
        <FeaturesSection />
        <FeedbackSection />
      </div>

      <FooterSection />
      
    </div>
  );
}
