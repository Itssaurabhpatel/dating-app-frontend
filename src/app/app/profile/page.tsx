"use client";

import React, { useState, useEffect } from "react";
import { api, ProfileResponse } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Save, User, Image as ImageIcon, Heart, MapPin, Briefcase, GraduationCap, AlignLeft, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AVAILABLE_INTERESTS = ["Hiking", "Tech", "Baking", "Gaming", "Photography", "Design", "Coffee", "Art", "Museums", "Yoga", "Music", "Reading", "Climbing", "Surfing", "Travel", "Wine", "Cooking", "Fitness", "Boxing", "Movies"];

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const loadProfile = async () => {
    try {
      const data = await api.getMyProfile();
      setProfile(data);
      setSelectedInterests(data.interests || []);
      setAvatarUrlInput(data.photos?.[0]?.url || "");
    } catch (e) {
      console.warn("Failed to load profile", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleFieldChange = (key: keyof ProfileResponse, value: any) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [key]: value
    });
  };

  const toggleInterest = (interest: string) => {
    let updated = [...selectedInterests];
    if (updated.includes(interest)) {
      updated = updated.filter((x) => x !== interest);
    } else {
      updated.push(interest);
    }
    setSelectedInterests(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    try {
      await api.updateProfile({
        name: profile.name,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        interestedIn: profile.interestedIn,
        bio: profile.bio,
        occupation: profile.occupation,
        education: profile.education,
        heightCm: profile.heightCm,
        religion: profile.religion,
        city: profile.city,
        country: profile.country,
        interests: selectedInterests
      });

      if (avatarUrlInput && avatarUrlInput !== profile.photos?.[0]?.url) {
        await api.uploadPhoto(avatarUrlInput);
      }

      toast.success("Profile saved successfully!");
      await loadProfile();
      refreshUser();
    } catch (err) {
      toast.error("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-500 font-medium">Loading profile details...</span>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 select-none">
        
        {/* Title */}
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Edit Profile
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-1"
          >
            Keep your dating profile fresh to increase match quality
          </motion.p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Custom Tabs */}
          <div className="bg-slate-200/50 p-1 rounded-2xl flex items-center gap-1">
            {["info", "media", "interests"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "info" ? "Basics" : tab === "media" ? "Photo" : "Interests"}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === "info" && (
              <div className="space-y-6">
                
                {/* Completion bar */}
                <div className="space-y-2 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-bold">Profile Strength</span>
                    <span className="font-bold text-rose-500">{profile.profileCompletion}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
                      style={{ width: `${profile.profileCompletion}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                        value={profile.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Birth Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                      value={profile.dateOfBirth || ""}
                      onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender</label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                      value={profile.gender || "MALE"}
                      onChange={(e) => handleFieldChange("gender", e.target.value)}
                      required
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Interested In</label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                      value={profile.interestedIn || "FEMALE"}
                      onChange={(e) => handleFieldChange("interestedIn", e.target.value)}
                      required
                    >
                      <option value="MALE">Men</option>
                      <option value="FEMALE">Women</option>
                      <option value="OTHER">Other</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Bio / Story</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      className="w-full min-h-[100px] pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all resize-none"
                      value={profile.bio || ""}
                      onChange={(e) => handleFieldChange("bio", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Occupation</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                        value={profile.occupation || ""}
                        onChange={(e) => handleFieldChange("occupation", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Education</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                        value={profile.education || ""}
                        onChange={(e) => handleFieldChange("education", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                        value={profile.city || ""}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Country</label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                      value={profile.country || ""}
                      onChange={(e) => handleFieldChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE PICTURE */}
            {activeTab === "media" && (
              <div className="flex flex-col items-center gap-6 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrlInput || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                  alt="Profile Avatar Preview"
                  className="w-40 h-40 rounded-3xl object-cover border-4 border-slate-50 shadow-lg"
                />

                <div className="space-y-3 w-full max-w-md">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Avatar Photo URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                    />
                  </div>
                  <span className="text-xs text-slate-400 block text-center mt-2">
                    Provide a valid image web URL to sync profile thumbnail pictures.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: TAG INTERESTS */}
            {activeTab === "interests" && (
              <div className="space-y-6">
                <div className="space-y-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" /> Interest Tag Cloud
                  </h3>
                  <p className="text-xs text-indigo-700/70 leading-relaxed">
                    Interests allow our semantic matching algorithms to calculate your compatibility score. Add at least 3 topics you enjoy.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {AVAILABLE_INTERESTS.map((tag) => {
                    const selected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`text-xs px-4 py-2 rounded-full border transition-all flex items-center gap-1.5 font-bold ${
                          selected
                            ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {tag}
                        {selected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-2xl shadow-xl shadow-slate-900/20 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving changes..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
