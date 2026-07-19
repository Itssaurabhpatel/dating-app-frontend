"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, SkipForward, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Mock profiles for the roulette UI
const mockRemoteProfiles = [
  { id: "1", name: "Stranger 1", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop" },
  { id: "2", name: "Stranger 2", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop" },
  { id: "3", name: "Stranger 3", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop" },
];

export default function ChatRoulettePage() {
  const { user } = useAuth();
  
  // States
  const [profileIndex, setProfileIndex] = useState(0);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected">("connecting");
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const clientRef = useRef<Client | null>(null);
  const currentProfile = mockRemoteProfiles[profileIndex];

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Connect to WebSocket
  useEffect(() => {
    setConnectionState("connecting");
    setMessages([]);

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws/chat"),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnectionState("connected");
        // Subscribe to public messages (for now, as a demo of binding)
        client.subscribe("/topic/messages", (message) => {
          if (message.body) {
            const parsed = JSON.parse(message.body);
            if (parsed.senderId !== user?.id) {
              setMessages(prev => [...prev, { sender: "remote", text: parsed.content }]);
            }
          }
        });
      },
      onDisconnect: () => {
        setConnectionState("connecting");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [profileIndex, user]);

  const handleNextPerson = () => {
    setProfileIndex((prev) => (prev + 1) % mockRemoteProfiles.length);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Optimistic UI update
    setMessages((prev) => [...prev, { sender: "local", text: chatMessage }]);
    
    // Send to backend
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify({
          type: "MESSAGE",
          senderId: user?.id || "anonymous",
          content: chatMessage,
          timestamp: Date.now()
        })
      });
    }

    setChatMessage("");
  };

  return (
    <div className="w-full h-full md:h-[calc(100vh-theme(spacing.16))] relative bg-slate-50 flex flex-col md:p-4 md:items-center">
      
      {/* 
        MAIN CHAT CONTAINER 
      */}
      <div className="w-full h-full md:max-w-4xl md:rounded-[32px] overflow-hidden bg-white border border-slate-200 shadow-xl flex flex-col relative z-10">
        
        {/* HEADER */}
        <div className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            {connectionState === "connected" ? (
              <>
                <Avatar className="w-10 h-10 border border-slate-200">
                  <AvatarImage src={currentProfile.avatar} />
                  <AvatarFallback><Users className="w-4 h-4 text-slate-400" /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{currentProfile.name}</span>
                  <span className="text-[11px] text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm">Searching...</span>
                  <span className="text-[11px] text-slate-400">Connecting to server</span>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleNextPerson}
            className="group relative h-10 px-5 rounded-full bg-slate-100 flex items-center justify-center gap-2 text-slate-700 font-bold hover:bg-rose-500 hover:text-white transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              Skip <SkipForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* CHAT MESSAGES AREA */}
        <div className="flex-1 bg-slate-50/50 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {connectionState === "connecting" ? (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-rose-500 animate-spin mb-4" />
                <h2 className="text-slate-800 font-bold text-lg">Looking for a match...</h2>
                <p className="text-slate-400 text-sm">You are chatting securely & anonymously.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="connected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 p-4 md:p-8 overflow-y-auto"
                ref={scrollRef}
              >
                <div className="flex flex-col gap-4 min-h-full justify-end pb-4">
                  {/* System message */}
                  <div className="text-center w-full my-4">
                    <span className="bg-slate-200/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                      You are now chatting with a stranger
                    </span>
                  </div>

                  <AnimatePresence>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.sender === "local" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`px-5 py-3 rounded-2xl text-sm max-w-[75%] shadow-sm ${
                          msg.sender === "local" 
                            ? "bg-rose-500 text-white rounded-br-sm" 
                            : "bg-white text-slate-700 border border-slate-100 rounded-bl-sm"
                        }`}>
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM INPUT BAR */}
        <div className="p-4 bg-white border-t border-slate-100 z-20">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={connectionState === "connecting"}
              placeholder={connectionState === "connecting" ? "Waiting for match..." : "Type a message..."}
              className="flex-1 bg-slate-100 border border-transparent text-slate-800 placeholder:text-slate-400 h-12 rounded-full pl-5 pr-12 focus:outline-none focus:bg-white focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={!chatMessage.trim() || connectionState === "connecting"}
              className="absolute right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 text-white -ml-0.5" />
            </button>
          </form>
        </div>
        
      </div>
      
    </div>
  );
}
