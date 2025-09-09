

import React from 'react';
import type { UserStats } from '../../../types/profile';

interface StatsOverviewProps {
  stats: UserStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Problems Solved',
      value: stats.totalProblems,
      icon: '🎯',
      color: 'from-green-500 to-emerald-600'
    },
    {
      label: 'Acceptance Rate',
      value: `${stats.acceptanceRate}%`,
      icon: '✅',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Current Streak',
      value: `${stats.streak.current} days`,
      icon: '🔥',
      color: 'from-orange-500 to-red-600'
    },
    {
      label: 'Contest Rating',
      value: stats.contestRating,
      icon: '🏆',
      color: 'from-purple-500 to-pink-600'
    },
    {
      label: 'Badges Earned',
      value: stats.badges,
      icon: '🏅',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Active Days',
      value: stats.activeDays,
      icon: '📅',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-sm`}>
              {stat.icon}
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
