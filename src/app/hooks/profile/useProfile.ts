import { useState, useEffect } from 'react';
import { profileService } from '../../../services/axios/user/profile';
import { imageKitService } from '../../../services/ImageKitService';

interface DayData {
  date: string;
  count: number;
}

interface BadgeInfo {
  id: string;
  name: string;
  imageUrl: string;
  color: string;
}

interface RecentBadgeInfo {
  imageUrl: string;
  title: string;
  year: number;
  color: string;
}

interface TransformedProfileData {
  user: {
    profileImage: string | null;
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
    list: BadgeInfo[];
    recent: RecentBadgeInfo;
  };
  heatmap: {
    data: DayData[];
    totalSubmissions: number;
    activeDays: number;
    maxStreak: number;
    currentStreak: number;
  };
  recentSubmissions: { id: string; title: string; timeAgo: string }[];
}

export const useProfile = () => {
  const [profileData, setProfileData] = useState<TransformedProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const transformActivitiesToHeatmap = (activities: Record<string, number>): DayData[] => {
  //   return Object.entries(activities).map(([date, count]) => ({
  //     date,
  //     count,
  //   }));
  // };

  const transformBadges = (badges: any[]): BadgeInfo[] => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#14b8a6'];
    return badges.map((badge, index) => {
      const badgeId = badge?.id || badge?.badgeId || `badge-${index}`;
      const badgeName = badge?.name || badge?.title || `Badge ${index + 1}`;
      const badgeImageKey = badge?.imageUrl || badge?.icon || '';
      const badgeImageUrl = badgeImageKey
        ? imageKitService.getOptimizedImageUrl(badgeImageKey, {
            width: 96,
            height: 96,
            crop: 'at_least',
            quality: 90,
            format: 'auto',
          })
        : '';

      return {
        id: String(badgeId),
        name: badgeName,
        imageUrl: badgeImageUrl,
        color: colors[index % colors.length],
      };
    });
  };

  const transformLanguages = (languages: any): { name: string; count: number }[] => {
    if (Array.isArray(languages)) {
      return languages.map(lang => {
        if (typeof lang === 'string') {
          return { name: lang, count: 0 };
        }
        if (typeof lang === 'object' && lang !== null) {
          return {
            name: lang.name || lang.language || String(lang),
            count: typeof lang.count === 'number' ? lang.count : 0,
          };
        }
        return { name: String(lang), count: 0 };
      });
    }
    if (typeof languages === 'object' && languages !== null) {
      return Object.entries(languages).map(([name, count]) => ({
        name,
        count: typeof count === 'number' ? count : 0,
      }));
    }
    return [];
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getUserProfile();

      console.log('API Response:', response);

      if (response.success && response.data) {
        const data = response.data;
        
        console.log('Profile Data:', data);
        
        const profileImageUrl = data.user?.profileImage
          ? imageKitService.getAvatarUrl(data.user.profileImage, 1000)
          : null;          

        const badgesSource = (data.badges || {}) as any;
        const badgesList = transformBadges(badgesSource.list || []);
        const recentBadgeImageKey = badgesSource.recent?.imageUrl || badgesSource.list?.[0]?.imageUrl || '';
        const badgesRecent: RecentBadgeInfo = {
          imageUrl: recentBadgeImageKey
            ? imageKitService.getOptimizedImageUrl(recentBadgeImageKey, {
                width: 96,
                height: 96,
                crop: 'at_least',
                quality: 90,
                format: 'auto',
              })
            : '',
          title: badgesSource.recent?.title || badgesSource.list?.[0]?.name || 'Latest Achievement',
          year: badgesSource.recent?.year || new Date().getFullYear(),
          color: badgesList[0]?.color || '#8b5cf6',
        };

        const badges: TransformedProfileData['badges'] = {
          total: badgesSource.total ?? badgesList.length,
          list: badgesList,
          recent: badgesRecent,
        };

        const transformed: TransformedProfileData = {
          user: {
            profileImage: profileImageUrl,
            name: data.user?.name || 'Unknown User',
            username: data.user?.username || 'unknown',
            bio: data.user?.bio || 'No bio available',
            location: data.user?.location || 'Unknown',
            githubUrl: data.user?.githubUrl || '#',
            linkedinUrl: data.user?.linkedinUrl || '#',
            languages: transformLanguages(data.user?.languages || data.user?.languages || data.languagesUsed || []),
          },
          stats: data.stats || {
            easy: { solved: 0, total: 3730 },
            medium: { solved: 0, total: 1942 },
            hard: { solved: 0, total: 879 },
            attempting: 0,
          },
          badges,
          heatmap: data.heatmap || {
            data: [],
            totalSubmissions: 0,
            activeDays: 0,
            maxStreak: 0,
            currentStreak: 0,
          },
          recentSubmissions: data.recentSubmissions || [],
        };

        console.log('Transformed Data:', transformed);
        setProfileData(transformed);
      } else {
        console.error('Response not successful or no data:', response);
        setError('Failed to load profile data: Invalid response');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(`Failed to load profile data: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profileData,
    loading,
    error,
    refetch: fetchProfile,
  };
};

