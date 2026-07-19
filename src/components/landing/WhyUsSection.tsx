"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ScanFace, MessageSquare, Zap, Brain, Target, Ghost, Ban } from "lucide-react";

const nodes = [
  { id: 1, nodeX: 507, nodeY: 150, title: "100% Verified Users", desc: "Registration requires biometric selfie matches. Safe gender markers block fake accounts and bots entirely.", defaultIcon: <ShieldCheck className="w-7 h-7 text-emerald-500" />, hoverIcon: <ScanFace className="w-7 h-7 text-emerald-600" />, color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/20" },
  { id: 2, nodeX: 591, nodeY: 300, title: "Real-time WebSockets", desc: "Instant chat feeds bypass message delays, syncing typings and reads in real time for a seamless flow.", defaultIcon: <MessageSquare className="w-7 h-7 text-sky-500" />, hoverIcon: <Zap className="w-7 h-7 text-sky-600" />, color: "from-sky-400 to-blue-500", shadow: "shadow-sky-500/20" },
  { id: 3, nodeX: 591, nodeY: 450, title: "Smart Compatibility", desc: "Know how likely a match is to spark based on deep bio text semantics before you even swipe.", defaultIcon: <Brain className="w-7 h-7 text-rose-500" />, hoverIcon: <Target className="w-7 h-7 text-rose-600" />, color: "from-rose-400 to-fuchsia-500", shadow: "shadow-rose-500/20" },
  { id: 4, nodeX: 507, nodeY: 600, title: "Anti-Ghosting System", desc: "Our intelligent algorithm penalizes inactive conversations and rewards responsive users, keeping the ecosystem alive.", defaultIcon: <Ghost className="w-7 h-7 text-violet-500" />, hoverIcon: <Ban className="w-7 h-7 text-violet-600" />, color: "from-violet-400 to-purple-500", shadow: "shadow-violet-500/20" },
];

const InteractiveNode = ({ node }: { node: typeof nodes[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className="absolute z-30 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-md transition-all duration-300"
      style={{ left: node.nodeX, top: node.nodeY }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
       <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={isHovered ? 'hover' : 'default'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative z-20"
            >
              {isHovered ? node.hoverIcon : node.defaultIcon}
            </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
}

export default function WhyUsSection() {
  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-slate-50">
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-rose-400/[0.02] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Mobile Header (Hidden on Desktop since Desktop uses the big circle) */}
        <div className="lg:hidden text-center mb-12 space-y-4">
          <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
            Differentiation
          </Badge>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">
            Why Choose Us
          </h2>
          <p className="text-sm text-slate-500 font-light px-4">
            Experience the safest, most transparent dating ecosystem ever built.
          </p>
        </div>

        {/* --- DESKTOP RADIAL INFOGRAPHIC --- */}
        <div className="hidden lg:block relative w-[1100px] max-w-full mx-auto h-[750px]">
          
          {/* Connecting SVG Lines & Orbit Arc */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* The Arc Orbit (Right half only) */}
            <motion.path
              d="M 280 55 A 320 320 0 0 1 280 695"
              fill="none" stroke="#e2e8f0" strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            
            {/* Horizontal Connection Lines */}
            {nodes.map(node => (
              <motion.line
                key={`line-${node.id}`}
                x1={node.nodeX}
                y1={node.nodeY}
                x2={650}
                y2={node.nodeY}
                stroke="#cbd5e1"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 + (node.id - 1) * 0.8 + 0.3, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* Left Hub (The Big Circle) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, type: "spring", damping: 25 }}
            className="absolute z-20 flex flex-col items-center justify-center rounded-full shadow-[0_20px_60px_-15px_rgba(225,29,72,0.4)] bg-gradient-to-br from-rose-500 via-fuchsia-600 to-violet-700 overflow-hidden"
            style={{ left: 30, top: 125, width: 500, height: 500 }}
          >
            {/* Inner glow/texture */}
            <div className="absolute inset-0 bg-white opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 0%, transparent 50%)' }} />
            
            <h2 className="text-white text-[56px] font-black tracking-tight text-center leading-[1.1] drop-shadow-xl relative z-10">
              WHY<br/>CHOOSE<br/>US
            </h2>
            <div className="mt-8 px-20 text-center text-rose-100 font-light text-[15px] relative z-10 leading-relaxed">
              Experience the safest, most transparent dating ecosystem ever built. We eliminated ghosting and catfishes.
            </div>
          </motion.div>

          {/* The Orbiting Nodes */}
          {nodes.map(node => (
            <motion.div
              key={`node-${node.id}`}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 + (node.id - 1) * 0.8, type: "spring" }}
            >
              <InteractiveNode node={node} />
            </motion.div>
          ))}

          {/* The Text Cards (Right Side) */}
          {nodes.map(node => (
            <motion.div
              key={`text-${node.id}`}
              className="absolute z-20 w-[420px] bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-rose-100 hover:shadow-[0_8px_30px_rgb(225,29,72,0.08)] transition-all duration-300"
              style={{ left: 650, top: node.nodeY }}
              initial={{ opacity: 0, x: 40, y: "-50%" }}
              whileInView={{ opacity: 1, x: 0, y: "-50%" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 + (node.id - 1) * 0.8 + 0.6, ease: "easeOut" }}
            >
               <h3 className="font-bold text-[17px] text-slate-800 mb-2 group-hover:text-rose-600 transition-colors duration-300">{node.title}</h3>
               <p className="text-[13px] text-slate-500 leading-relaxed font-light group-hover:text-slate-600 transition-colors duration-300">{node.desc}</p>
            </motion.div>
          ))}
          
        </div>

        {/* --- MOBILE STACKED LAYOUT --- */}
        <div className="block lg:hidden space-y-4 max-w-lg mx-auto">
          {nodes.map(node => (
            <div key={`mob-${node.id}`} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden group">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${node.color}`} />
              <div className="shrink-0 w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100 relative z-10 group-hover:scale-110 transition-transform duration-300">
                 {node.defaultIcon}
              </div>
              <div className="relative z-10">
                 <h3 className="font-bold text-lg text-slate-800 mb-1">{node.title}</h3>
                 <p className="text-[13px] text-slate-500 leading-relaxed font-light">{node.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
