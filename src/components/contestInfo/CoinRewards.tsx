
import { ContestState } from '../../types/contest-info';
import type { ContestDTO, ContestRewardDTO } from '../../types/contest.dto';

interface CoinRewardsProps {
  contest: ContestDTO;
  compact?: boolean;
}

const getRewardCardColor = (rank: number): string => {
  if (rank === 1) return 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-300';
  if (rank === 2) return 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-300';
  if (rank === 3) return 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300';
  return 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-300';
};

const getRewardIcon = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getGridCols = (rewardsLength: number, isContestNotStarted: boolean): string => {
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

const CoinRewards = ({ contest, compact = false }: CoinRewardsProps) => {
  const isContestNotStarted =
    contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN;
  const rewardsLength = contest.coinRewards?.length || 0;
  const isCompact = compact || rewardsLength > 3; // allow forcing compact visuals

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-trophy w-6 h-6 text-yellow-500" />
        Coin Rewards & Positions
      </h3>
      <div
        className={`grid ${isCompact ? '' : getGridCols(rewardsLength, isContestNotStarted)} ${isCompact ? 'gap-2' : 'gap-3'}`}
        style={isCompact ? { gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' } : undefined}
      >
        {contest.coinRewards.map((reward: ContestRewardDTO) => (
          <div
            key={reward.rank}
            className={`${isContestNotStarted ? (isCompact ? 'p-2' : 'p-6') : (isCompact ? 'p-2' : 'p-4')} rounded-lg ${isCompact ? 'border' : 'border-2'} text-center ${getRewardCardColor(
              reward.rank
            )}`}
          >
            <div className={`${isContestNotStarted ? (isCompact ? 'text-2xl' : 'text-5xl') : (isCompact ? 'text-xl' : 'text-3xl')} mb-1`}>
              {getRewardIcon(reward.rank)}
            </div>
            <div className={`${isContestNotStarted ? (isCompact ? 'text-xs' : 'text-lg') : (isCompact ? 'text-[11px]' : 'text-sm')} text-gray-600 mb-0.5`}>
              Rank {reward.rank}
            </div>
            <div
              className={`${isContestNotStarted ? (isCompact ? 'text-base' : 'text-xl') : (isCompact ? 'text-sm' : 'text-lg')} font-bold text-blue-600 flex items-center justify-center gap-1`}
            >
              <i className={`fas fa-star ${isContestNotStarted ? (isCompact ? 'w-3.5 h-3.5' : 'w-5 h-5') : (isCompact ? 'w-3 h-3' : 'w-4 h-4')} fill-current`} />
              {reward.coins}
            </div>
            <div className={`${isContestNotStarted ? (isCompact ? 'text-[10px]' : 'text-sm') : (isCompact ? 'text-[10px]' : 'text-xs')} text-gray-500 mt-0.5`}>coins</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinRewards;