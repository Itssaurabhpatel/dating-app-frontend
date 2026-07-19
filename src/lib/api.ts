export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || response.statusText || "An error occurred",
      data
    );
  }

  return data;
}

export interface MatchResponse {
  id: string;
  matchId?: string;
  name: string;
  pic: string;
  matchScore: number;
  lastMessage?: string;
  lastActive: string;
  isOnline: boolean;
  isPremium: boolean;
  isVerified: boolean;
  distance: number;
  unreadCount?: number;
  matchedUser?: any;
}

export interface DiscoverProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  profilePhotoUrl: string;
  photos: any[];
  compatibilityScore: number;
  occupation?: string;
  education?: string;
  location?: string;
  city?: string;
  country?: string;
  bio?: string;
  interests?: string[];
  distance?: number;
  dateOfBirth?: string;
  gender?: string;
  interestedIn?: string;
  heightCm?: number;
  religion?: string;
  profileCompletion?: number;
}

export type ProfileResponse = DiscoverProfile;

export interface MessageResponse {
  id: string;
  matchId?: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "GET" }),
    
  post: (endpoint: string, body: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
    
  put: (endpoint: string, body: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: "DELETE" }),

  // Temporary mock functions for compilation until Phase 2/3
  getChatRooms: async (): Promise<MatchResponse[]> => {
    return [];
  },
  getMessages: async (matchId?: string): Promise<MessageResponse[]> => {
    return [];
  },
  markAsRead: async (matchId?: string): Promise<void> => {
    return;
  },
  unmatch: async (matchId?: string): Promise<void> => {
    return;
  },
  discover: async (filters?: any): Promise<DiscoverProfile[]> => {
    return [];
  },
  swipe: async (userId: string, action: string): Promise<{ match: boolean; matchId?: string }> => {
    return { match: false };
  },
  undoSwipe: async (): Promise<void> => {
    return;
  },
  getIsDemoMode: (): boolean => {
    return false;
  },
  getLikes: async (): Promise<any[]> => {
    return [];
  },
  getMyProfile: async (): Promise<any> => {
    return {};
  },
  updateProfile: async (data: any): Promise<any> => {
    return {};
  },
  uploadPhoto: async (file: File | string): Promise<{url: string}> => {
    return { url: "" };
  },
  deletePhoto: async (url: string): Promise<void> => {
    return;
  },
  getRecommendations: async (): Promise<any[]> => {
    return [];
  },
  getBoosted: async (): Promise<any[]> => {
    return [];
  },
  getUserId: (): string => {
    return "temp-user-id";
  },
  randomMatch: {
    join: () => api.post("/random/join", {}),
    leave: () => api.post("/random/leave", {}),
    next: (currentMatchId?: string) => api.post(`/random/next${currentMatchId ? `?currentMatchId=${currentMatchId}` : ""}`, {})
  },
  history: () => api.get("/matches/history"),
  acceptLike: (id: string) => api.post(`/likes/${id}/accept`, {}),
  rejectLike: (id: string) => api.post(`/likes/${id}/reject`, {}),
  liveRooms: {
    list: () => api.get("/rooms"),
    create: (data: any) => api.post("/rooms", data),
    join: (id: string) => api.post(`/rooms/${id}/join`, {}),
    leave: (id: string) => api.post(`/rooms/${id}/leave`, {})
  }
};
