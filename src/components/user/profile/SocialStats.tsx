

import React from 'react';

interface SocialStatsProps {
  followersCount: number;
  followingCount: number;
}

export const SocialStats: React.FC<SocialStatsProps> = ({ 
  followersCount, 
  followingCount 
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4">Community</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">Followers</div>
              <div className="text-sm text-gray-400">People following you</div>
            </div>
          </div>
          <div className="text-xl font-bold text-white">{followersCount}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">Following</div>
              <div className="text-sm text-gray-400">People you follow</div>
            </div>
          </div>
          <div className="text-xl font-bold text-white">{followingCount}</div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            View Followers
          </button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            View Following
          </button>
        </div>
      </div>
    </div>
  );
};
