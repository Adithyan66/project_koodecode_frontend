

import React from 'react';
import { imageKitService } from '../../services/ImageKitService';

const LeaderboardEntry = ({ entry }) => {
  const initials = (name: string) => {
    if (!name) return 'U';
    const parts = String(name).trim().split(' ');
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const isYou = !!entry.isCurrentUser;
  return (
    <div className={`p-3 rounded-lg ${isYou ? 'border border-yellow-500/50 bg-yellow-900/10' : 'border border-gray-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank === 1
                ? 'bg-yellow-500 text-black'
                : entry.rank === 2
                  ? 'bg-gray-400 text-black'
                  : entry.rank === 3
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-700 text-gray-300'
              }`}
          >
            {entry.rank}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              {entry.profileImage ? (
                <img src={imageKitService.getAvatarUrl(entry.profileImage, 96)} alt={entry.username} className="w-12 h-12 rounded-full object-cover ring-1 ring-gray-700" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-sm font-semibold ring-1 ring-gray-700">
                  {initials(entry.username)}
                </div>
              )}
              {isYou && (
                <i className="fas fa-crown text-yellow-400 absolute -top-2 -right-2 text-sm drop-shadow" />
              )}
            </div>
            <div>
              <p className={`font-medium text-sm ${isYou ? 'text-yellow-300' : 'text-white'}`}>
                {entry.username}
                {isYou && <span className="ml-1 text-xs">(You)</span>}
              </p>
              <p className="text-gray-400 text-xs">{entry.timeTaken}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-semibold text-sm">{entry.totalScore}</p>
          <p className="text-gray-400 text-xs">{entry.attempts} attempts</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardEntry;