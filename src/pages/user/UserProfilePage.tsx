import React from 'react';
import Navbar from '../../components/user/Navbar';
import { ProfileSidebar } from '../../components/user/profile/ProfileSidebar';
import { StatsCircles } from '../../components/user/profile/StatsCircles';
import { BadgesSection } from '../../components/user/profile/BadgesSection';
import { SubmissionHeatmap } from '../../components/user/profile/SubmissionHeatmap';
import { RecentSubmissions } from '../../components/user/profile/RecentSubmissions';
import { useProfile } from '../../app/hooks/profile/useProfile';
import RotatingSpinner from '../../components/common/LoadingSpinner';

const UserProfilePage: React.FC = () => {
  const { profileData, loading, error } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <RotatingSpinner/>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">Failed to load profile</p>
            <p className="text-gray-400">{error || 'Unknown error occurred'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <ProfileSidebar
              profileImage={profileData.user.profileImage}
              name={profileData.user.name}
              username={profileData.user.username}
              bio={profileData.user.bio}
              location={profileData.user.location}
              githubUrl={profileData.user.githubUrl}
              linkedinUrl={profileData.user.linkedinUrl}
              languages={profileData.user.languages}
            />
          </div>

          <div className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCircles
                easy={profileData.stats.easy}
                medium={profileData.stats.medium}
                hard={profileData.stats.hard}
                attempting={profileData.stats.attempting}
              />

              <BadgesSection
                totalBadges={profileData.badges.total}
                badges={profileData.badges.list}
                recentBadge={profileData.badges.recent}
              />
            </div>

            <SubmissionHeatmap
              data={profileData.heatmap.data}
              totalSubmissions={profileData.heatmap.totalSubmissions}
              activeDays={profileData.heatmap.activeDays}
              maxStreak={profileData.heatmap.maxStreak}
              currentStreak={profileData.heatmap.currentStreak}
            />

            <RecentSubmissions submissions={profileData.recentSubmissions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

