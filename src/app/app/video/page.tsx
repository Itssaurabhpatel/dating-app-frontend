"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, MicOff, VideoOff, MessageSquare, Heart, Settings2, SkipForward, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Mock profiles for the roulette
const mockRemoteProfiles = [
  { id: "1", name: "Stranger 1", location: "New York, USA", videoBg: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop", tags: ["Travel", "Photography"], likesYou: true },
  { id: "2", name: "Stranger 2", location: "London, UK", videoBg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop", tags: ["Music", "Fitness"], likesYou: false },
];

export default function VideoRoulettePage() {
  const { user } = useAuth();
  
  // States
  const [profileIndex, setProfileIndex] = useState(0);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected">("connecting");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);

  // WebRTC & WebSocket Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const currentProfile = mockRemoteProfiles[profileIndex];

  // Initialize Local Media (Runs once on mount)
  useEffect(() => {
    const initLocalVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    initLocalVideo();

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
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
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

          // Simulate making an offer if we are the "initiator" (random logic for demo)
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
      localStreamRef.current.getVideoTracks().forEach(track => { track.enabled = isVideoOn; });
    }
  }, [isMicOn, isVideoOn]);

  const handleNextPerson = () => {
    setConnectionState("connecting");
    setProfileIndex((prev) => (prev + 1) % mockRemoteProfiles.length);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: "local", text: chatMessage }]);
    setChatMessage("");
  };

  return (
    <div className="w-full h-full md:h-[calc(100vh-theme(spacing.16))] relative bg-black overflow-hidden flex flex-col md:p-4">
      <div className="relative w-full h-full md:rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex flex-col md:flex-row">
        
        {/* LOCAL USER (Sender) */}
        <div className="relative w-full h-1/2 md:w-1/2 md:h-full bg-slate-800 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          <video 
            ref={localVideoRef}
            autoPlay 
            playsInline 
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${!isVideoOn ? 'hidden' : ''}`}
          />
          {!isVideoOn && (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <VideoOff className="w-12 h-12 text-slate-500" />
            </div>
          )}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
            <span className="text-white text-xs font-bold">You</span>
            {!isMicOn && <MicOff className="w-3 h-3 text-red-500" />}
          </div>
        </div>

        {/* REMOTE USER (Receiver) */}
        <div className="relative w-full h-1/2 md:w-1/2 md:h-full bg-slate-900 overflow-hidden">
          <AnimatePresence mode="wait">
            {connectionState === "connecting" ? (
              <motion.div 
                key="connecting-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-20"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-rose-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-6 h-6 text-slate-500 animate-pulse" />
                  </div>
                </div>
                <h2 className="text-white mt-4 font-bold text-base tracking-wide">Finding next match...</h2>
              </motion.div>
            ) : (
              <motion.div
                key={`profile-${currentProfile.id}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 z-0"
              >
                <video 
                  ref={remoteVideoRef}
                  autoPlay 
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Fallback image if video fails to load (demo purporses) */}
                <img 
                  src={currentProfile.videoBg} 
                  alt={currentProfile.name} 
                  className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                
                <div className="absolute top-4 right-4 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                  <div className="flex flex-col items-end">
                    <h3 className="text-white font-bold text-xs tracking-tight">{currentProfile.name}</h3>
                    <p className="text-white/70 text-[9px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {currentProfile.location}
                    </p>
                  </div>
                  <Avatar className="w-8 h-8 border-2 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                    <AvatarImage src={currentProfile.videoBg} className="object-cover" />
                    <AvatarFallback>{currentProfile.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CHAT OVERLAY */}
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
                      ? "bg-rose-500/80 text-white border-rose-400/50 rounded-br-sm" 
                      : "bg-white/20 text-white border-white/20 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM CONTROLS BAR */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-40">
          <div className="flex items-end justify-between gap-4 max-w-4xl mx-auto w-full">
            <form onSubmit={handleSendMessage} className="flex-1 max-w-sm relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Say something..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/50 h-12 rounded-full pl-5 pr-12 focus:outline-none focus:border-rose-500/50 focus:bg-white/20 transition-all shadow-lg"
              />
              <button 
                type="submit" 
                disabled={!chatMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors"
              >
                <Send className="w-4 h-4 text-white -ml-0.5" />
              </button>
            </form>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg ${
                  isMicOn ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-red-500/90 border-transparent text-white"
                }`}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg hidden sm:flex ${
                  isVideoOn ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-red-500/90 border-transparent text-white"
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={handleNextPerson}
                className="group relative h-12 px-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center gap-2 text-white font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Next <SkipForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
