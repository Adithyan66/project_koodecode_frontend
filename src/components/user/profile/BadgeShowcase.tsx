

import React from 'react';

import type { Badge } from '../../../types/profile';


interface BadgeShowcaseProps {
  badges: Badge[];
  totalBadges: number;
  onBadgeClick: (badge: Badge) => void;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ 
  badges, 
  totalBadges, 
  onBadgeClick 
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-700';
      case 'rare': return 'from-blue-600 to-blue-700';
      case 'epic': return 'from-purple-600 to-purple-700';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'problem_solver': return '🎯';
      case 'streak_master': return '🔥';
      case 'difficulty_master': return '💪';
      case 'contest_winner': return '🏆';
      case 'daily_coder': return '📅';
      default: return '🏅';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Badges</h3>
        <span className="text-gray-400 text-sm">{totalBadges} earned</span>
      </div>
      
      {badges.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🏅</div>
          <p className="text-gray-400">No badges earned yet</p>
          <p className="text-sm text-gray-500">Keep solving problems to earn your first badge!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.badgeId}
              onClick={() => onBadgeClick(badge)}
              className="relative group cursor-pointer"
            >
              <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${getRarityColor(badge.rarity)} p-1 hover:scale-105 transition-transform duration-200`}>
                <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
                  {getBadgeIcon(badge.badgeType)}
                </div>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-gray-600">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-gray-300">{badge.rarity}</div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          ))}
          
          {/* Show more indicator if there are more badges */}
          {totalBadges > badges.length && (
            <div className="w-full aspect-square rounded-xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:border-gray-500 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-lg">+{totalBadges - badges.length}</div>
                <div className="text-xs">more</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
