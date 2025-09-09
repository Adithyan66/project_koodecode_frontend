

import React from 'react';
import type { Badge } from '../../../types/profile';

interface RecentActivityProps {
  activities: Record<string, number>;
  recentBadges: Badge[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  recentBadges 
}) => {
  // Get recent activity entries
  const recentActivities = Object.entries(activities)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 7);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {/* Recent Badges */}
        {recentBadges.slice(0, 2).map((badge) => (
          <div key={badge.badgeId} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-sm">
              🏅
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Earned {badge.name}</div>
              <div className="text-sm text-gray-400">
                {formatDate(badge.awardedAt.split('T')[0])}
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              badge.rarity === 'legendary' ? 'bg-yellow-900 text-yellow-300' :
              badge.rarity === 'epic' ? 'bg-purple-900 text-purple-300' :
              badge.rarity === 'rare' ? 'bg-blue-900 text-blue-300' :
              'bg-gray-700 text-gray-300'
            }`}>
              {badge.rarity}
            </div>
          </div>
        ))}
        
        {/* Recent Problem Solving */}
        {recentActivities.slice(0, 5).map(([date, count]) => (
          <div key={date} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-sm">
              🎯
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">
                Solved {count} problem{count !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-400">
                {formatDate(date)}
              </div>
            </div>
            <div className="text-green-400 font-bold">
              +{count}
            </div>
          </div>
        ))}
        
        {recentActivities.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-500">Start solving problems to see your activity here!</p>
          </div>
        )}
      </div>
    </div>
  );
};
