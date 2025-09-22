

// src/components/user/contests/CoinRewards.tsx
import React from 'react';
import { ContestState } from '../../../types/contest-info';

const getRewardCardColor = (rank) => {
  if (rank === 1) return 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-300';
  if (rank === 2) return 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-300';
  if (rank === 3) return 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300';
  return 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-300';
};

const getRewardIcon = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getGridCols = (rewardsLength, isContestNotStarted) => {
  if (isContestNotStarted) {
    if (rewardsLength <= 2) return 'grid-cols-1';
    if (rewardsLength <= 4) return 'grid-cols-2';
    if (rewardsLength <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  } else {
    if (rewardsLength <= 3) return 'grid-cols-3';
    if (rewardsLength <= 4) return 'grid-cols-4';
    if (rewardsLength <= 5) return 'grid-cols-5';
    return 'grid-cols-6';
  }
};

const CoinRewards = ({ contest }) => {
  const isContestNotStarted =
    contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-trophy w-6 h-6 text-yellow-500" />
        Coin Rewards & Positions
      </h3>
      <div className={`grid ${getGridCols(contest.coinRewards.length, isContestNotStarted)} gap-3`}>
        {contest.coinRewards.map((reward) => (
          <div
            key={reward.rank}
            className={`${isContestNotStarted ? 'p-6' : 'p-4'} rounded-lg border-2 text-center ${getRewardCardColor(
              reward.rank
            )}`}
          >
            <div className={`${isContestNotStarted ? 'text-5xl' : 'text-3xl'} mb-2`}>
              {getRewardIcon(reward.rank)}
            </div>
            <div className={`${isContestNotStarted ? 'text-lg' : 'text-sm'} text-gray-600 mb-1`}>
              Rank {reward.rank}
            </div>
            <div
              className={`${isContestNotStarted ? 'text-xl' : 'text-lg'} font-bold text-blue-600 flex items-center justify-center gap-1`}
            >
              <i className={`fas fa-star ${isContestNotStarted ? 'w-5 h-5' : 'w-4 h-4'} fill-current`} />
              {reward.coins}
            </div>
            <div className={`${isContestNotStarted ? 'text-sm' : 'text-xs'} text-gray-500 mt-1`}>coins</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinRewards;