"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Send, Sparkles, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type MatchState = "IDLE" | "SEARCHING" | "CONNECTED";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function RandomDiscoverPage() {
  const [matchState, setMatchState] = useState<MatchState>("IDLE");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUserId = api.getUserId();

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const disconnectWebSocket = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws/chat"),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: function (str) {
        console.log("STOMP: ", str);
      },
      onConnect: () => {
        console.log("Connected to STOMP");
        
        // Subscribe to match events
        client.subscribe("/user/queue/random-match", (msg) => {
          const payload = JSON.parse(msg.body);
          console.log("Received random match event:", payload);
          
          if (payload.type === "MATCHED") {
            setMatchId(payload.matchId);
            setPartnerId(payload.partnerId);
            setMatchState("CONNECTED");
            setMessages([]); // Clear chat
            toast.success("You're connected to a stranger!");
          } else if (payload.type === "PARTNER_LEFT") {
            toast.info("Stranger disconnected.");
            setMatchState("IDLE");
            setMatchId(null);
            setPartnerId(null);
          }
        });

        // Subscribe to global messages (filtering by matchId in state)
        client.subscribe("/topic/messages", (msg) => {
          const m = JSON.parse(msg.body);
          setMessages(prev => {
            // Check if we already have this message
            if (prev.some(x => x.id === m.id)) return prev;
            return [...prev, m];
          });
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    setStompClient(client);
  };

  const handleStart = async () => {
    try {
      setMatchState("SEARCHING");
      await api.randomMatch.join();
      connectWebSocket();
    } catch (e: any) {
      toast.error(e.message || "Failed to join queue");
      setMatchState("IDLE");
    }
  };

  const handleCancel = async () => {
    try {
      await api.randomMatch.leave();
    } catch (e) {
      console.warn(e);
    }
    disconnectWebSocket();
    setMatchState("IDLE");
  };

  const handleNext = async () => {
    try {
      setMatchState("SEARCHING");
      setMessages([]);
      await api.randomMatch.next(matchId || undefined);
      // Keep websocket connected, wait for next MATCHED event
    } catch (e: any) {
      toast.error(e.message || "Failed to find next person");
      setMatchState("IDLE");
      disconnectWebSocket();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !matchId) return;

    try {
      const tempMessage: Message = {
        id: "temp-" + Date.now(),
        senderId: currentUserId,
        content: messageInput,
        createdAt: new Date().toISOString()
      };
      
      // Optimistically add to UI
      setMessages(prev => [...prev, tempMessage]);
      setMessageInput("");

      // Send via standard REST API
      const req = await fetch(`http://localhost:8080/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          "X-User-Id": currentUserId
        },
        body: JSON.stringify({ matchId, content: tempMessage.content })
      });
      
      if (!req.ok) {
        throw new Error("Failed to send message");
      }
      
      // If the backend broadcasts via /topic/messages, we will receive it twice,
      // but our duplicate check prevents rendering it twice.
      
    } catch (e: any) {
      toast.error("Failed to send message");
    }
  };

  // Poll for messages periodically as a fallback if WebSocket message receiving is flaky
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matchState === "CONNECTED" && matchId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/v1/messages/${matchId}?page=0&size=100`, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
              "X-User-Id": currentUserId
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
              // Merge avoiding duplicates
              setMessages(prev => {
                const newMsgs = data.data.reverse(); // assuming backend sends newest first
                const map = new Map();
                prev.forEach(m => map.set(m.id, m));
                newMsgs.forEach((m: any) => map.set(m.id, m));
                return Array.from(map.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
              });
            }
          }
        } catch (e) {
          console.warn("Polling error", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [matchState, matchId, currentUserId]);


  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (matchState !== "IDLE") {
        api.randomMatch.leave().catch(() => {});
      }
      disconnectWebSocket();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full h-full relative">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-border/40 select-none">
        <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-love flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Live Connect
        </h1>
        {matchState === "CONNECTED" && (
          <Button variant="ghost" size="sm" onClick={handleCancel} className="text-muted-foreground hover:text-rose-500">
            <LogOut className="w-4 h-4 mr-2" /> Disconnect
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* IDLE STATE */}
        {matchState === "IDLE" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 w-full flex flex-col items-center justify-center text-center gap-8"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-love/10 flex items-center justify-center animate-pulse-slow">
              <User className="w-16 h-16 text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black">Meet Someone New</h2>
              <p className="text-muted-foreground font-light max-w-sm">
                Instantly connect with random strangers online for a live chat experience.
              </p>
            </div>
            <Button 
              onClick={handleStart}
              className="bg-gradient-love text-white text-lg font-bold h-14 px-12 rounded-full shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
            >
              Start Chatting
            </Button>
          </motion.div>
        )}

        {/* SEARCHING STATE */}
        {matchState === "SEARCHING" && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 w-full flex flex-col items-center justify-center text-center gap-8"
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 border-4 border-primary rounded-full animate-ping opacity-40" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center z-10 shadow-lg shadow-primary/50">
                <Search className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold animate-pulse">Searching for a stranger...</h2>
            
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="h-12 px-8 rounded-full border-2 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500 transition-colors mt-8"
            >
              Stop Searching
            </Button>
          </motion.div>
        )}

        {/* CONNECTED STATE (CHAT UI) */}
        {matchState === "CONNECTED" && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 w-full flex flex-col bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-border/50 mt-4"
          >
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 space-y-2">
                  <Sparkles className="w-8 h-8" />
                  <p>You're now chatting with a random stranger.</p>
                  <p>Say hi!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  // Determine if the message is from us by checking if the senderId matches our ID.
                  // Since we might not have a reliable currentUserId if using mock auth, 
                  // we can check if it matches the partnerId. If not partnerId, it's us!
                  const isMe = msg.senderId !== partnerId;
                  
                  return (
                    <div key={msg.id || i} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-gradient-love text-white rounded-tr-sm' 
                          : 'bg-muted text-foreground rounded-tl-sm border border-border/50'
                      }`}>
                        <div className="font-bold text-[10px] opacity-50 mb-1">
                          {isMe ? 'You' : 'Stranger'}
                        </div>
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input & Controls */}
            <div className="p-4 bg-background border-t border-border/40">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={handleNext}
                  variant="outline" 
                  className="shrink-0 h-12 w-20 border-2 font-bold hover:bg-primary/10 hover:text-primary transition-colors rounded-xl"
                >
                  NEXT
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full h-12 pr-12 rounded-xl bg-card border-2 focus-visible:ring-0 focus-visible:border-primary text-base"
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    disabled={!messageInput.trim()}
                    size="icon" 
                    className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg bg-primary text-white shadow-sm hover:scale-105 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
