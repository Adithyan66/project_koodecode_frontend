




import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import ContestHeader from '../../components/user/contest/ContestHeader';
import ContestDetailsGrid from '../../components/user/contest/ContestDetailsGrid';
import ContestActionButton from '../../components/user/contest/ContestActionButton';
import CoinRewards from '../../components/user/contest/CoinRewards';
import ContestRules from '../../components/user/contest/ContestRules';
import LeaderboardEntry from '../../components/contests/LeaderboardEntry';
import { useContestInfo } from '../../app/hooks/contest/useContestInfo';
import { useLeaderboardRefresh } from '../../app/hooks/contest/useLeaderboardRefresh';
import { useContestTimer } from '../../app/hooks/contest/useContestTimer';
import { ContestState } from '../../types/contest-info';
import { formatDate } from '../../utils/format';

const ContestInfoPage = () => {
  const navigate = useNavigate();
  const { contest, isLoading, isRegistering, error, handleRegister } = useContestInfo();
  const leaderboard = useLeaderboardRefresh(contest);
  const countdown = useContestTimer(contest);

  const handleEnterContest = () => {
    if (!contest || !contest.contestNumber) return;
    navigate(`/contest/${contest.contestNumber}/participate`);
  };

  if (error && !contest) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <i className="fas fa-exclamation-circle w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Contest</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !contest) {
    return (
      <>
        <Navbar />
        <div className="bg-black w-full h-screen"></div>
      </>
    );
  }

  const isContestNotStarted =
    contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN;

  return (
    <div className="bg-black text-white flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto bg-black rounded-xl shadow-lg overflow-hidden">
        <ContestHeader contest={contest} />
        <div className="p-6 border-b bg-black-50">
          {(contest.state === ContestState.UPCOMING ||
            contest.state === ContestState.REGISTRATION_OPEN ||
            contest.state === ContestState.ACTIVE) && (
              <div className="mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-3">
                    {contest.state === ContestState.ACTIVE ? 'Contest Ends In' : 'Contest Starts In'}
                  </h3>
                  <div className="flex justify-center gap-4">
                    {Object.entries(countdown).map(([unit, value]) => (
                      <div key={unit} className="text-center">
                        <div className="bg-white rounded-lg p-3 shadow-sm min-w-[60px]">
                          <div className="text-2xl font-bold text-gray-800">{value}</div>
                          <div className="text-xs text-gray-500 uppercase">{unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          <ContestDetailsGrid contest={contest} />
          <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{contest.description}</p>
          </div>
          <div className="mt-6">
            <ContestActionButton
              contest={contest}
              isRegistering={isRegistering}
              handleRegister={handleRegister}
              handleEnterContest={handleEnterContest}
            />
          </div>
        </div>
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <CoinRewards contest={contest} />
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-trophy w-6 h-6 text-purple-500" />
                Leaderboard
              </h3>
              {isContestNotStarted ? (
                <div className="bg-gray-950 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
                  <i className="fas fa-trophy w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-400 mb-2">Contest Not Started</h4>
                  <p className="text-gray-400">
                    Leaderboard will be available once the contest begins
                  </p>
                </div>
              ) : leaderboard && leaderboard.rankings.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">
                        <strong>{leaderboard.totalParticipants}</strong> participants
                      </span>
                      <span className="text-blue-600">
                        {/* Last updated: {formatDate(leaderboard.lastUpdated)} */}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {leaderboard.rankings.map((entry, index) => (
                      <LeaderboardEntry key={entry.userId} entry={entry} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <i className="fas fa-users w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No participants yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ContestRules contest={contest} />
      </div>
    </div>
  );
};

export default ContestInfoPage;