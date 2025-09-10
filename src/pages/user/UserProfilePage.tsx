


import React, { useEffect, useState } from 'react';
import { ProfileHeader } from '../../components/user/profile/ProfileHeader';
import { StatsOverview } from '../../components/user/profile/StatsOverview';
import { ProblemStatsChart } from '../../components/user/profile/ProblemStatsChart';
import { StreakCalendar } from '../../components/user/profile/StreakCalendar';
import { BadgeShowcase } from '../../components/user/profile/BadgeShowcase';
import { RecentActivity } from '../../components/user/profile/RecentActivity';
import { SocialStats } from '../../components/user/profile/SocialStats';
import type { Badge, UserProfileData } from '../../types/profile';
import Navbar from '../../components/user/Navbar';
import httpClient from '../../services/axios/httpClient';


const UserProfilePage: React.FC = () => {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);

    async function fetchProfileData() {
        try {
            const response = await httpClient.get(`/user`);
            if (response.data.success) {
                setProfileData(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
        }
    }

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (!profileData) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Profile Header */}
                <ProfileHeader
                    user={profileData.user}
                    profile={profileData.profile}
                />

                {/* Stats Overview */}
                <div className="mt-8">
                    <StatsOverview stats={profileData.stats} />
                </div>

                {/* Main Content Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Charts and Calendar */}
                    <div className="lg:col-span-2 space-y-8">
                        <ProblemStatsChart stats={profileData.stats} />

                        <StreakCalendar
                            activities={profileData.activities}
                            currentStreak={profileData.stats.streak.current}
                            maxStreak={profileData.stats.streak.max}
                        />
                    </div>

                    {/* Right Column - Badges and Activity */}
                    <div className="space-y-8">
                        <SocialStats
                            followersCount={profileData.stats.followersCount}
                            followingCount={profileData.stats.followingCount}
                        />

                        <BadgeShowcase
                            badges={profileData.recentBadges}
                            totalBadges={profileData.stats.badges}
                            onBadgeClick={setSelectedBadge}
                        />

                        <RecentActivity
                            activities={profileData.activities}
                            recentBadges={profileData.recentBadges}
                        />
                    </div>
                </div>

                {/* Badge Detail Modal */}
                {selectedBadge && (
                    <BadgeDetailModal
                        badge={selectedBadge}
                        onClose={() => setSelectedBadge(null)}
                    />
                )}
            </div>
        </div>
    );
};

// Badge Detail Modal Component
interface BadgeDetailModalProps {
    badge: Badge;
    onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, onClose }) => {
    const rarityColors: Record<string, string> = {
        common: 'from-gray-600 to-gray-700',
        rare: 'from-blue-600 to-blue-700',
        epic: 'from-purple-600 to-purple-700',
        legendary: 'from-yellow-500 to-orange-600'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity] || 'from-gray-600 to-gray-700'} flex items-center justify-center text-2xl`}>
                        🏆
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
                <p className="text-gray-300 mb-4">{badge.description}</p>

                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${rarityColors[badge.rarity] || 'from-gray-600 to-gray-700'} text-white`}>
                        {badge.rarity?.charAt(0).toUpperCase() + badge.rarity?.slice(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                        {new Date(badge.awardedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
