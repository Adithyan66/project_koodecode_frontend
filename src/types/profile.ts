

export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  profilePicKey?: string;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  githubUrl?: string;
  linkedinUrl?: string;
  isPremium: boolean;
  ranking?: number;
  coinBalance: number;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  totalProblems: number;
  problemsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  streak: {
    current: number;
    max: number;
    lastActiveDate?: string;
  };
  badges: number;
  acceptanceRate: number;
  contestRating: number;
  activeDays: number;
}

export interface Badge {
  badgeId: string;
  name: string;
  description: string;
  iconUrl: string;
  badgeType: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  awardedAt: string;
}

export interface UserProfileData {
  languagesUsed: { name: string; count: number; }[];
  user: {
    profileImage: string;
    name: string;
    username: string;
    bio: string;
    location: string;
    githubUrl: string;
    linkedinUrl: string;
    languages: { name: string; count: number }[];
  };
  stats: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
    attempting: number;
  };
  badges: {
    total: number;
    list: any[];
    recent?: {
      icon: string;
      title: string;
      year: number;
      color: string;
    };
  };
  heatmap: {
    data: { date: string; count: number }[];
    totalSubmissions: number;
    activeDays: number;
    maxStreak: number;
    currentStreak: number;
  };
  recentSubmissions: {
    id: string;
    title: string;
    timeAgo: string;
  }[];
}

export interface ApiUserProfileResponse {
  success: boolean;
  data: UserProfileData;
  message?: string;
}
