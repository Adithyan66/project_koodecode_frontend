import React, { useState } from 'react';
import { ProfileHeader } from '../../components/user/profile/ProfileHeader';
import { StatsOverview } from '../../components/user/profile/StatsOverview';
import { ProblemStatsChart } from '../../components/user/profile/ProblemStatsChart';
import { StreakCalendar } from '../../components/user/profile/StreakCalendar';
import { BadgeShowcase } from '../../components/user/profile/BadgeShowcase';
import { RecentActivity } from '../../components/user/profile/RecentActivity';
import { SocialStats } from '../../components/user/profile/SocialStats';
import type { Badge } from '../../types/profile';
import type { UserProfileData } from '../../types/profile';


// Dummy data - matches your backend response structure
const dummyUserProfile: UserProfileData = {
    user: {
        id: "user123",
        fullName: "Adithyan Kumar",
        userName: "adithyan_dev",
        email: "adithyan@koodecode.com",
        profilePicUrl: undefined
    },
    profile: {
        bio: "Full-stack developer passionate about algorithms and clean code architecture. Building KoodeCode with TypeScript, MongoDB, and React. Love solving complex problems and teaching others! 🚀",
        location: "Kerala, India",
        githubUrl: "https://github.com/adithyan",
        linkedinUrl: "https://linkedin.com/in/adithyan-kumar",
        isPremium: true,
        ranking: 1247,
        coinBalance: 2500,
        gender: "male"
    },
    stats: {
        followersCount: 234,
        followingCount: 189,
        totalProblems: 247,
        problemsByDifficulty: {
            easy: 87,
            medium: 134,
            hard: 26
        },
        streak: {
            current: 23,
            max: 67,
            lastActiveDate: "2025-09-09T00:00:00.000Z"
        },
        badges: 12,
        acceptanceRate: 73.2,
        contestRating: 1856,
        activeDays: 156
    },
    activities: {
        "2025-09-09": 4,
        "2025-09-08": 2,
        "2025-09-07": 1,
        "2025-09-06": 3,
        "2025-09-05": 1,
        "2025-09-04": 5,
        "2025-09-03": 2,
        "2025-09-02": 1,
        "2025-09-01": 3,
        "2025-08-31": 2,
        "2025-08-30": 4,
        "2025-08-29": 1,
        "2025-08-28": 2,
        "2025-08-27": 3,
        // ... more activity data for past 365 days
    },
    recentBadges: [
        {
            badgeId: "badge1",
            name: "Streak Master",
            description: "Maintained a 30-day coding streak",
            iconUrl: "/badges/streak-master.svg",
            badgeType: "streak_master",
            rarity: "rare",
            awardedAt: "2025-09-08T10:30:00.000Z"
        },
        {
            badgeId: "badge2",
            name: "Problem Solver",
            description: "Solved 200 problems",
            iconUrl: "/badges/problem-solver.svg",
            badgeType: "problem_solver",
            rarity: "epic",
            awardedAt: "2025-09-05T14:15:00.000Z"
        },
        {
            badgeId: "badge3",
            name: "Hard Hitter",
            description: "Solved 25 Hard problems",
            iconUrl: "/badges/hard-hitter.svg",
            badgeType: "difficulty_master",
            rarity: "legendary",
            awardedAt: "2025-08-28T09:45:00.000Z"
        }
    ]
};

const UserProfilePage: React.FC = () => {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Profile Header */}
                <ProfileHeader
                    user={dummyUserProfile.user}
                    profile={dummyUserProfile.profile}
                />

                {/* Stats Overview */}
                <div className="mt-8">
                    <StatsOverview stats={dummyUserProfile.stats} />
                </div>

                {/* Main Content Grid */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Charts and Calendar */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Problem Stats Chart */}
                        <ProblemStatsChart
                            stats={dummyUserProfile.stats}
                        />

                        {/* Streak Calendar */}
                        <StreakCalendar
                            activities={dummyUserProfile.activities}
                            currentStreak={dummyUserProfile.stats.streak.current}
                            maxStreak={dummyUserProfile.stats.streak.max}
                        />

                    </div>

                    {/* Right Column - Badges and Activity */}
                    <div className="space-y-8">

                        {/* Social Stats */}
                        <SocialStats
                            followersCount={dummyUserProfile.stats.followersCount}
                            followingCount={dummyUserProfile.stats.followingCount}
                        />

                        {/* Badge Showcase */}
                        <BadgeShowcase
                            badges={dummyUserProfile.recentBadges}
                            totalBadges={dummyUserProfile.stats.badges}
                            onBadgeClick={setSelectedBadge}
                        />

                        {/* Recent Activity */}
                        <RecentActivity
                            activities={dummyUserProfile.activities}
                            recentBadges={dummyUserProfile.recentBadges}
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
    const rarityColors = {
        common: 'from-gray-600 to-gray-700',
        rare: 'from-blue-600 to-blue-700',
        epic: 'from-purple-600 to-purple-700',
        legendary: 'from-yellow-500 to-orange-600'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${rarityColors[badge.rarity]} flex items-center justify-center text-2xl`}>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${rarityColors[badge.rarity]} text-white`}>
                        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                        {new Date(badge.awardedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};


export default UserProfilePage