

import React from 'react';
import { LeaderboardEntry as LeaderboardEntryType } from '../../types/contest';

const LeaderboardEntry = ({ entry }) => {
  return (
    <div
      className={`p-3 border border-gray-800 rounded-lg ${entry.isCurrentUser ? 'bg-green-900/20 border-green-600' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank === 1
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
          <div>
            <p
              className={`font-medium text-sm ${entry.isCurrentUser ? 'text-green-400' : 'text-white'}`}
            >
              {entry.username}
              {entry.isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
            </p>
            <p className="text-gray-400 text-xs">{entry.timeTaken}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-medium text-sm">{entry.totalScore}</p>
          <p className="text-gray-400 text-xs">{entry.attempts} attempts</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardEntry;