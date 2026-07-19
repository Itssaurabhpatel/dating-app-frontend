"use client";

import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ActiveUsersSection() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const countries = [
    { name: "India", code: "in" },
    { name: "United Kingdom", code: "gb" },
    { name: "United States", code: "us" },
    { name: "Canada", code: "ca" },
    { name: "Australia", code: "au" },
    { name: "Germany", code: "de" },
    { name: "South Africa", code: "za" },
    { name: "UAE", code: "ae" },
    { name: "France", code: "fr" },
    { name: "Italy", code: "it" },
    { name: "Spain", code: "es" },
    { name: "Japan", code: "jp" },
    { name: "South Korea", code: "kr" },
    { name: "China", code: "cn" },
    { name: "Russia", code: "ru" },
    { name: "Brazil", code: "br" },
    { name: "Mexico", code: "mx" },
    { name: "Saudi Arabia", code: "sa" },
    { name: "Turkey", code: "tr" },
    { name: "Thailand", code: "th" },
    { name: "Vietnam", code: "vn" },
    { name: "Indonesia", code: "id" },
    { name: "Malaysia", code: "my" },
    { name: "Singapore", code: "sg" },
    { name: "Philippines", code: "ph" },
    { name: "Argentina", code: "ar" },
    { name: "Colombia", code: "co" },
    { name: "Peru", code: "pe" },
    { name: "Sweden", code: "se" },
    { name: "Norway", code: "no" }
  ];

  // Duplicate for a seamless infinite loop
  const marqueeItems = [...countries, ...countries];

  useGSAP(() => {
    gsap.to(".marquee-inner", {
      xPercent: -50,
      ease: "none",
      duration: 500, // Drastically increased duration to make it very slow
      repeat: -1,
    });
  }, { scope: marqueeRef });

  return (
    <section id="our-users" className="py-24 max-w-full overflow-hidden border-b border-slate-100 bg-white">
      <div className="text-center space-y-4 mb-16 select-none px-6">
        <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
          Global Reach
        </Badge>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Active Worldwide</h2>
        <p className="text-base text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
          HeartSync is connecting verified singles across more than 30 countries globally.
        </p>
      </div>

      <div ref={marqueeRef} className="relative flex overflow-hidden py-4">
        {/* Left & Right Fade Masks for a clean enter/exit effect */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="marquee-inner flex gap-6 w-max px-3">
          {marqueeItems.map((country, idx) => (
            <div 
              key={`${country.name}-${idx}`} 
              className="flex items-center gap-3 px-5 py-4 rounded-full border-2 border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm cursor-default whitespace-nowrap"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://flagcdn.com/w40/${country.code}.png`} 
                srcSet={`https://flagcdn.com/w80/${country.code}.png 2x`}
                alt={`${country.name} flag`}
                className="w-8 h-8 object-cover rounded-full shadow-sm shrink-0"
              />
              <span className="text-base font-bold tracking-wide">{country.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
