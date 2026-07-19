"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Zap, 
  Check, 
  X, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Database,
  ArrowRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeConnections, setActiveConnections] = useState(142);
  const [matchCount, setMatchCount] = useState(12890);
  const [logs, setLogs] = useState<string[]>([
    "Gateway STOMP connection opened from Client IP: 192.168.1.45",
    "Selfie verification request queued for User ID: neha_23",
    "AI compatibility match computed: Aarav & Priya (94% match)",
    "WebSocket session sync completed for Client IP: 157.45.12.89",
  ]);

  // Catfish auditing items
  const [pendingAudits, setPendingAudits] = useState([
    {
      id: "audit-1",
      name: "Aarav, 25",
      regPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      selfiePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      matchScore: 98.4,
      gender: "Male"
    },
    {
      id: "audit-2",
      name: "Neha, 23",
      regPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      selfiePhoto: "https://images.unsplash.com/photo-1534751516642-a131ffd107fd?w=300&auto=format&fit=crop&q=80",
      matchScore: 34.2,
      gender: "Female"
    },
    {
      id: "audit-3",
      name: "Kabir, 27",
      regPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
      selfiePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
      matchScore: 100.0,
      gender: "Male"
    }
  ]);

  // Simulate real-time stats updates & logs
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly toggle active connections
      setActiveConnections(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      // randomly increase match computations
      setMatchCount(prev => prev + Math.floor(Math.random() * 3));

      // append simulated log
      const simulationLogs = [
        `Live WebSocket packet broadcasted to channel: /topic/discover`,
        `Selfie classification request successfully processed`,
        `Match computed: Kabir & Ananya (89% match)`,
        `Client IP: 103.88.22.45 connected to gateway`,
        `Heartbeat signal received from User ID: priya_22`,
      ];
      const randomLog = simulationLogs[Math.floor(Math.random() * simulationLogs.length)];
      setLogs(prev => [randomLog, ...prev.slice(0, 3)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = (id: string, name: string) => {
    setPendingAudits(prev => prev.filter(item => item.id !== id));
    toast.success(`Selfie approved for ${name}. Gold Verified Badge issued successfully!`);
  };

  const handleFlag = (id: string, name: string) => {
    setPendingAudits(prev => prev.filter(item => item.id !== id));
    toast.error(`Suspended account ${name} for failed selfie authentication audit.`);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0612] text-white relative overflow-hidden flex flex-col font-sans select-none scroll-smooth">
      
      {/* Background neon elements */}
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      {/* Admin header */}
      <header className="sticky top-0 z-50 bg-[#0a0612]/80 border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg">
            <Heart className="w-4.5 h-4.5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-white font-heading">HeartSync Admin Portal</span>
            <span className="text-[8px] font-bold text-rose-400 tracking-widest uppercase">System Control Center</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            GATEWAY ONLINE
          </div>
          
          <Link href="/">
            <Button size="sm" variant="outline" className="text-xs font-bold border-white/10 text-white/80 hover:text-white bg-white/5 h-8 rounded-lg">
              Return to Site
            </Button>
          </Link>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8 z-10">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Stat 1 */}
          <Card className="bg-white/5 border-white/5 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Active Sockets</span>
              <Activity className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black">{activeConnections}</span>
              <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Live
              </span>
            </div>
          </Card>

          {/* Stat 2 */}
          <Card className="bg-white/5 border-white/5 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Matches Computed</span>
              <Zap className="w-4.5 h-4.5 text-rose-500" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black">{matchCount.toLocaleString()}</span>
              <span className="text-[9px] text-rose-400 font-bold">+2.4k today</span>
            </div>
          </Card>

          {/* Stat 3 */}
          <Card className="bg-white/5 border-white/5 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Pending Audits</span>
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black">{pendingAudits.length}</span>
              <span className="text-[9px] text-amber-400 font-bold">Action Required</span>
            </div>
          </Card>

          {/* Stat 4 */}
          <Card className="bg-white/5 border-white/5 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Success Rate</span>
              <UserCheck className="w-4.5 h-4.5 text-fuchsia-500" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black">76.8%</span>
              <span className="text-[9px] text-fuchsia-400 font-bold">High Accuracy</span>
            </div>
          </Card>

        </div>

        {/* Audit Queue Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-black uppercase tracking-tight">Catfish Auditing Queue</h2>
            <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md">Selfie Checker</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {pendingAudits.length === 0 ? (
              <div className="lg:col-span-3 bg-white/5 border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/40 font-light text-xs">
                All selfie verifications audited successfully. Queue is empty.
              </div>
            ) : (
              pendingAudits.map((item) => (
                <Card key={item.id} className="bg-white/5 border-white/5 text-white rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg">
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-white/80">{item.name}</span>
                      <Badge className={`text-[8px] font-bold border-none rounded-md px-2 py-0.5 ${item.gender === 'Female' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {item.gender}
                      </Badge>
                    </div>

                    {/* Image comparison stack */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5 text-center">
                        <span className="text-[8px] uppercase tracking-wider text-white/40 block">Register Portrait</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.regPhoto} alt="Reg" className="w-full h-36 object-cover rounded-xl border border-white/5" />
                      </div>
                      <div className="space-y-1.5 text-center">
                        <span className="text-[8px] uppercase tracking-wider text-white/40 block">Live Selfie Scan</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.selfiePhoto} alt="Selfie" className="w-full h-36 object-cover rounded-xl border border-white/5" />
                      </div>
                    </div>

                    {/* Biometric classification status */}
                    <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center justify-between text-xs">
                      <span className="text-white/50">Facial Mesh Match:</span>
                      <span className={`font-black ${item.matchScore > 80 ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>
                        {item.matchScore}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl h-9"
                      onClick={() => handleApprove(item.id, item.name)}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl h-9"
                      onClick={() => handleFlag(item.id, item.name)}
                    >
                      <X className="w-4 h-4 mr-1" /> Suspend
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Lower Details: Live System Sockets and database nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sockets Live Logs Monitor */}
          <Card className="lg:col-span-2 bg-white/5 border-white/5 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Gateway sockets feed</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-2.5 font-mono text-[9px] text-white/60 leading-relaxed text-left">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 items-start border-l border-rose-500/30 pl-2">
                    <span className="text-rose-400 font-bold shrink-0">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 text-right">
              <span className="text-[8px] text-white/30 uppercase tracking-widest font-black">STOMP channel subscription status: active</span>
            </div>
          </Card>

          {/* Database System Node checks */}
          <Card className="bg-white/5 border-white/5 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <ShieldAlert className="w-4 h-4 text-fuchsia-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Security Node Check</span>
              </div>
              <ul className="space-y-3.5 text-xs text-white/80 text-left">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> Microservices health standard</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> WebSocket TLS status secure</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> Selfie classifier load-balance OK</li>
              </ul>
            </div>
            <div className="pt-4 text-[9px] text-white/30 font-medium leading-relaxed">
              All microservice instances reports zero vulnerabilities. Secure handshake standard enforced.
            </div>
          </Card>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#06030c] py-6 px-6 text-center text-xs text-white/30 font-light z-10">
        © 2026 HeartSync Enterprise. System administration logs are subject to active audits.
      </footer>

    </div>
  );
}
