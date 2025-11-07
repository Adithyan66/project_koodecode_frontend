


import { Medal, Star, TrendingUp, Trophy } from 'lucide-react';

interface UserStats {
  totalContestsParticipated: number;
  bestRank: number;
  averageRank: number;
  totalCoinsEarned: number;
}

const UserStatsCard = ({ stats }: { stats: UserStats | null }) => {
  if (!stats) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold text-green-400 mb-4">Your Contest Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center text-gray-400">
          <Medal className="h-5 w-5 mr-2" />
          <span>Total Contests: {stats.totalContestsParticipated}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <Star className="h-5 w-5 mr-2" />
          <span>Best Rank: #{stats.bestRank}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <TrendingUp className="h-5 w-5 mr-2" />
          <span>Average Rank: #{stats.averageRank}</span>
        </div>
        <div className="flex items-center text-gray-400">
          <Trophy className="h-5 w-5 mr-2" />
          <span>Coins Earned: {stats.totalCoinsEarned}</span>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;