"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  interestedIn?: string;
  bio?: string;
  city?: string;
  country?: string;
  profilePhotoUrl?: string;
  isPremium?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        
        if (storedToken) {
          setToken(storedToken);
          
          // Fetch current user details from API
          const response = await api.get("/auth/me");
          if (response?.data) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to authenticate user during initialization:", error);
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/auth/logout", {});
      }
    } catch (e) {
      console.error("Logout API failed, continuing client logout", e);
    } finally {
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const refreshUser = async () => {
    try {
      if (token) {
        const res = await api.get("/auth/me");
        if (res && res.data) {
          setUser(res.data);
        }
      }
    } catch (e) {
      console.error("Failed to refresh user", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
