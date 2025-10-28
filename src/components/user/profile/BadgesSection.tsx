import React from 'react';

interface Badge {
  id: string;
  icon: string;
  color: string;
}

interface RecentBadge {
  icon: string;
  title: string;
  year: number;
  color: string;
}

interface BadgesSectionProps {
  totalBadges: number;
  badges: Badge[];
  recentBadge: RecentBadge;
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  totalBadges,
  badges,
  recentBadge,
}) => {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-white text-sm font-semibold">Badges</h3>
            <p className="text-gray-400 text-lg font-bold">{totalBadges}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {badges.slice(0, 6).map((badge) => (
          <div
            key={badge.id}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: badge.color }}
          >
            {badge.icon}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-3">
        <h4 className="text-gray-400 text-xs mb-2">Most Recent Badge</h4>
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            style={{ backgroundColor: recentBadge.color }}
          >
            {recentBadge.icon}
          </div>
          <div>
            <h5 className="text-white font-semibold text-xs">{recentBadge.title}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

