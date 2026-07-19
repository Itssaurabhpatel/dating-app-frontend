"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Heart, Sparkles, LogOut, User as UserIcon, MessageSquare, Compass, Users, ToggleLeft, ToggleRight, Clock, Video, Phone, Network, Send } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Loading Heartbeat State
  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background select-none">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 absolute animate-ping duration-1000" />
          <div className="w-12 h-12 rounded-xl bg-gradient-love flex items-center justify-center text-white shadow-xl relative z-10 animate-bounce">
            <Heart className="w-7 h-7 fill-white" />
          </div>
        </div>
        <span className="text-sm font-semibold tracking-wider text-muted-foreground mt-6 uppercase animate-pulse">
          Synchronizing Connections...
        </span>
      </div>
    );
  }

  const navItems = [
    { name: "Recommendations", href: "/app/recommendations", icon: Sparkles },
    { name: "History", href: "/app/history", icon: Clock },
    { name: "Groups", href: "/app/groups", icon: Users },
    { name: "Connects", href: "/app/connects", icon: Network },
    { name: "Send Invite", href: "/app/invite", icon: Send },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-card/45 backdrop-blur-xl p-4 shrink-0 justify-between select-none">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-love flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="font-bold tracking-tight text-gradient-love">HeartSync</span>
            </Link>
          </div>


          {/* Sidebar Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      active
                        ? "bg-primary text-white shadow-md shadow-primary/15"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? "text-white" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
                      <span>{item.name}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Settings */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <Link href="/app/profile">
            <div className={`flex items-center gap-3 p-2 rounded-2xl cursor-pointer hover:bg-muted/40 transition-colors ${pathname === "/app/profile" ? "bg-muted/40 border border-primary/20" : ""}`}>
              <Avatar className="w-10 h-10 border border-primary/20">
                <AvatarImage src={user.profilePhotoUrl} className="object-cover" />
                <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate leading-tight">{user.name}</span>
                <span className="text-[11px] text-muted-foreground truncate font-light">Edit Profile</span>
              </div>
            </div>
          </Link>

          <Button
            onClick={logout}
            variant="ghost"
            className="w-full text-xs hover:bg-destructive/10 hover:text-destructive text-muted-foreground justify-start gap-2 h-9 px-3 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Bottom Navigation */}
      <header className="md:hidden sticky top-0 z-40 bg-card/65 backdrop-blur-xl border-b border-border/30 px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-love flex items-center justify-center text-white shadow-sm">
            <Heart className="w-4.5 h-4.5 fill-white" />
          </div>
          <span className="font-bold tracking-tight text-sm text-gradient-love">HeartSync</span>
        </div>

        <div className="flex items-center gap-3">

          <Link href="/app/profile">
            <Avatar className="w-7 h-7 border border-primary/20">
              <AvatarImage src={user.profilePhotoUrl} className="object-cover" />
              <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen overflow-hidden bg-slate-50">
        
        {/* Top Header with Quick Action Buttons */}
        <header className="flex-shrink-0 h-16 md:h-20 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-end z-30 shadow-sm">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            {pathname !== '/app/video' && (
              <Link href="/app/video" className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all text-slate-600 hover:bg-white hover:text-rose-500 hover:shadow-sm">
                <Video className="w-4 h-4" /> <span className="hidden sm:inline">Video Call</span>
              </Link>
            )}
            {pathname !== '/app/audio' && (
              <Link href="/app/audio" className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all text-slate-600 hover:bg-white hover:text-indigo-500 hover:shadow-sm">
                <Phone className="w-4 h-4" /> <span className="hidden sm:inline">Audio Call</span>
              </Link>
            )}
            {pathname !== '/app/chat' && (
              <Link href="/app/chat" className="flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all text-slate-600 hover:bg-white hover:text-purple-500 hover:shadow-sm">
                <MessageSquare className="w-4 h-4" /> <span className="hidden sm:inline">Chat</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0 flex flex-col relative">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on immersive roulette pages) */}
      {!['/app/video', '/app/audio', '/app/chat'].includes(pathname) && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-t border-border/30 px-3 py-1 flex justify-around items-center select-none">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className="flex-1">
                <div className="flex flex-col items-center justify-center py-1 gap-0.5 cursor-pointer">
                  <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-primary/10 text-primary scale-110" : "text-muted-foreground"}`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <span className={`text-[9px] font-medium leading-none ${active ? "text-primary font-semibold" : "text-muted-foreground/80 font-light"}`}>
                    {item.name.split(" ")[0]}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
