"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, SkipForward, Send, Radio } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Mock profiles for the roulette
const mockRemoteProfiles = [
  { id: "1", name: "Sarah, 24", location: "New York, USA", avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop" },
  { id: "2", name: "Alex, 26", location: "London, UK", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop" },
];

export default function AudioRoulettePage() {
  const { user } = useAuth();
  
  // States
  const [profileIndex, setProfileIndex] = useState(0);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected">("connecting");
  const [isMicOn, setIsMicOn] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);

  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const currentProfile = mockRemoteProfiles[profileIndex];

  // Initialize Local Media (Runs once on mount)
  useEffect(() => {
    const initLocalAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        localStreamRef.current = stream;
      } catch (error) {
        console.error("Error accessing audio device.", error);
      }
    };

    initLocalAudio();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize WebRTC Connection & Signaling (Runs when swapping users)
  useEffect(() => {
    let stompClient: Client;

    const initWebRTC = () => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
        ]
      });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && stompClientRef.current?.connected) {
          stompClientRef.current.publish({
            destination: "/app/call.signaling",
            body: JSON.stringify({
              type: "ICE_CANDIDATE",
              senderId: user?.id,
              recipientId: currentProfile.id,
              candidate: event.candidate.toJSON()
            })
          });
        }
      };

      peerConnectionRef.current = pc;
    };

    const initSignaling = () => {
      stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws/chat"),
        reconnectDelay: 5000,
        onConnect: () => {
          stompClient.subscribe(`/user/${user?.id}/queue/call`, async (message) => {
            const parsed = JSON.parse(message.body);
            const pc = peerConnectionRef.current;
            if (!pc) return;

            if (parsed.type === "CALL_OFFER") {
              await pc.setRemoteDescription(new RTCSessionDescription(parsed.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              stompClient.publish({
                destination: "/app/call.signaling",
                body: JSON.stringify({
                  type: "CALL_ANSWER",
                  senderId: user?.id,
                  recipientId: parsed.senderId,
                  sdp: answer
                })
              });
              setConnectionState("connected");
            } else if (parsed.type === "CALL_ANSWER") {
              await pc.setRemoteDescription(new RTCSessionDescription(parsed.sdp));
              setConnectionState("connected");
            } else if (parsed.type === "ICE_CANDIDATE") {
              await pc.addIceCandidate(new RTCIceCandidate(parsed.candidate));
            }
          });

          // Simulate making an offer if we are the "initiator"
          setTimeout(async () => {
            if (peerConnectionRef.current) {
              const offer = await peerConnectionRef.current.createOffer();
              await peerConnectionRef.current.setLocalDescription(offer);
              stompClient.publish({
                destination: "/app/call.signaling",
                body: JSON.stringify({
                  type: "CALL_OFFER",
                  senderId: user?.id,
                  recipientId: currentProfile.id,
                  sdp: offer
                })
              });
            }
          }, 1000);
        }
      });
      stompClient.activate();
      stompClientRef.current = stompClient;
    };

    // Wait a brief moment to ensure localStream is ready before creating PC
    setTimeout(() => {
      initWebRTC();
      initSignaling();
    }, 500);

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [profileIndex, currentProfile.id, user?.id]);

  // Toggle Media
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => { track.enabled = isMicOn; });
    }
  }, [isMicOn]);

  const handleNextPerson = () => {
    setConnectionState("connecting");
    setProfileIndex((prev) => (prev + 1) % mockRemoteProfiles.length);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: "local", text: chatMessage }]);
    
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
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
    <div className="w-full h-full md:h-[calc(100vh-theme(spacing.16))] relative bg-slate-950 overflow-hidden flex flex-col md:p-4">
      <div className="relative w-full h-full md:rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center">
        
        {/* Hidden Audio Element for Remote Stream */}
        <audio ref={remoteAudioRef} autoPlay />

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40 opacity-50" />
        
        <AnimatePresence mode="wait">
          {connectionState === "connecting" ? (
            <motion.div 
              key="connecting-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Radio className="w-8 h-8 text-slate-500 animate-pulse" />
                </div>
              </div>
              <h2 className="text-white mt-6 font-bold text-lg tracking-wide">Tuning in...</h2>
              <p className="text-slate-400 text-sm mt-2">Finding next audio match</p>
            </motion.div>
          ) : (
            <motion.div
              key={`profile-${currentProfile.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="relative z-10 flex flex-col items-center justify-center w-full"
            >
              <div className="relative flex items-center justify-center mb-8">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-indigo-500/50"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.8, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut",
                    }}
                  />
                ))}
                
                <Avatar className="w-32 h-32 border-4 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)] z-10 relative bg-slate-800">
                  <AvatarImage src={currentProfile.avatar} className="object-cover" />
                  <AvatarFallback>{currentProfile.name[0]}</AvatarFallback>
                </Avatar>
              </div>

              <h3 className="text-white font-bold text-2xl tracking-tight mb-2">{currentProfile.name}</h3>
              <p className="text-indigo-300 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                On Call
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-6 right-6 z-30 bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-white/10 shadow-lg">
          <Avatar className="w-10 h-10 border border-white/20">
            <AvatarImage src={user?.profilePhotoUrl || ""} />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold">You</span>
            <span className={`text-[10px] ${isMicOn ? "text-green-400" : "text-red-400"}`}>
              {isMicOn ? "Mic On" : "Muted"}
            </span>
          </div>
        </div>

        <div className="absolute bottom-24 left-6 z-30 w-full max-w-[280px] md:max-w-xs flex flex-col justify-end pointer-events-none">
          <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-auto no-scrollbar pointer-events-auto mask-image-b pb-2">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.sender === "local" ? 20 : -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`flex ${msg.sender === "local" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] backdrop-blur-md border ${
                    msg.sender === "local" 
                      ? "bg-indigo-600 text-white border-indigo-500 rounded-br-sm shadow-lg" 
                      : "bg-slate-800/80 text-white border-white/10 rounded-bl-sm shadow-lg"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-40 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
          <div className="flex items-end justify-between gap-4 max-w-4xl mx-auto w-full">
            <form onSubmit={handleSendMessage} className="flex-1 max-w-sm relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Message while calling..."
                className="w-full bg-slate-800/80 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 h-12 rounded-full pl-5 pr-12 focus:outline-none focus:border-indigo-500/50 transition-all shadow-lg"
              />
              <button 
                type="submit" 
                disabled={!chatMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
              >
                <Send className="w-4 h-4 text-white -ml-0.5" />
              </button>
            </form>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg ${
                  isMicOn ? "bg-slate-800/80 border border-white/10 text-white hover:bg-slate-700" : "bg-red-500/90 border-transparent text-white"
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button 
                className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/90 hover:bg-red-600 transition-all shadow-lg text-white"
                onClick={handleNextPerson}
              >
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </button>

              <button 
                onClick={handleNextPerson}
                className="group relative h-12 px-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center gap-2 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Skip <SkipForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
