import LeaderboardEntry from '../contests/LeaderboardEntry';
import { Users } from 'lucide-react';

interface ContestLeaderboardProps {
  isContestNotStarted: boolean;
  leaderboard: any;
}

const ContestLeaderboard = ({ isContestNotStarted, leaderboard }: ContestLeaderboardProps) => {
  return (
    <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full">
      <div className="flex-1 flex flex-col min-h-0 px-1">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-3">
            <i className="fas fa-trophy w-7 h-7 text-green-400" />
            <h3 className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent tracking-tight">
              Leaderboard
            </h3>
          </div>
        </div>
        {isContestNotStarted ? (
          <div className="rounded-lg p-12 text-center">
            <i className="fas fa-trophy w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-300 mb-2">Contest Not Started</h4>
            <p className="text-gray-400">Leaderboard will be available once the contest begins</p>
          </div>
        ) : leaderboard && leaderboard.rankings && leaderboard.rankings.length > 0 ? (
          <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0" style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}>
            {leaderboard.rankings.map((entry: any) => (
              <LeaderboardEntry key={entry.userId || `${entry.username}-${entry.rank}`} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="rounded-lg p-12 text-center w-full">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-full p-4 border-2 border-green-500/40">
                    <Users className="w-16 h-16 text-green-400 animate-pulse" />
                  </div>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">No Participants Yet</h4>
              <p className="text-gray-400 max-w-md mx-auto">
                The leaderboard will update in real-time as participants register and start competing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestLeaderboard;

