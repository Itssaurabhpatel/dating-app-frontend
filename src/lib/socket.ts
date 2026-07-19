import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { api, API_BASE_URL } from "./api";

export interface WebSocketMessage {
  id?: string;
  matchId?: string;
  senderId: string;
  content: string;
  createdAt?: string;
}

type MessageCallback = (msg: WebSocketMessage) => void;

class SocketClient {
  private client: Client | null = null;
  private subscriptions: { [key: string]: any } = {};
  private listeners: Set<MessageCallback> = new Set();

  connect() {
    try {
      this.client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws/chat`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log("Connected to STOMP WebSocket:", frame);
          this.subscribeToMessages();
        },
        onStompError: (frame) => {
          console.error("STOMP error", frame.body);
        },
        onDisconnect: () => {
          console.log("STOMP disconnected");
        }
      });

      this.client.activate();
    } catch (err) {
      console.error("STOMP connection setup failed:", err);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.subscriptions = {};
  }

  subscribe(callback: MessageCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private subscribeToMessages() {
    if (!this.client || !this.client.connected) return;

    const sub = this.client.subscribe("/topic/messages", (message) => {
      try {
        const payload: WebSocketMessage = JSON.parse(message.body);
        this.listeners.forEach((cb) => cb(payload));
      } catch (err) {
        console.error("Failed to parse incoming WebSocket message:", err);
      }
    });

    this.subscriptions["messages"] = sub;
  }

  sendMessage(matchId: string | undefined, content: string) {
    if (!matchId) return;
    const senderId = api.getUserId();
    const messagePayload: WebSocketMessage = {
      matchId,
      senderId,
      content,
      createdAt: new Date().toISOString()
    };

    if (this.client && this.client.connected) {
      this.client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(messagePayload),
      });
    } else {
      console.warn("STOMP client not connected. Falling back to HTTP POST.");
      api.post(`/chat/${matchId}/messages`, { content }).catch(console.error);
    }
  }
}

export const socket = new SocketClient();
