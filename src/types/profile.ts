

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
  user: User;
  profile: UserProfile;
  stats: UserStats;
  activities: Record<string, number>;
  recentBadges: Badge[];
}
