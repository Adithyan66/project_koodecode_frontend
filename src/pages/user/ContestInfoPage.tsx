



import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import ContestHeader from '../../components/user/contest/ContestHeader';
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
  const { contest, isLoading, isRegistering, error, handleRegister, refetchContest } = useContestInfo();
  const leaderboard = useLeaderboardRefresh(contest);
  const countdown = useContestTimer(contest);
  const hasRefetchedOnZero = useRef(false);

  // Refetch once when countdown hits zero to update contest state and actions
  useEffect(() => {
    if (!contest) return;
    const isZero =
      countdown.days === 0 &&
      countdown.hours === 0 &&
      countdown.minutes === 0 &&
      countdown.seconds === 0;
    if (isZero && !hasRefetchedOnZero.current) {
      hasRefetchedOnZero.current = true;
      refetchContest?.();
    }
    if (!isZero) {
      hasRefetchedOnZero.current = false;
    }
  }, [countdown, contest, refetchContest]);

  const handleEnterContest = () => {
    const cLocal = contest as any;
    if (!cLocal || !cLocal.contestNumber) return;
    try {
      window.sessionStorage.setItem(`contest:${cLocal.contestNumber}:entered`, '1');
    } catch {}
    navigate(`/contest/${cLocal.contestNumber}/participate`, { state: { fromEnter: true } });
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

  const c = contest as any;
  const lb = leaderboard as any;
  const isContestNotStarted = c.state === ContestState.UPCOMING || c.state === ContestState.REGISTRATION_OPEN;


  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Contest header with thumbnail */}
            <div className="bg-gray-900/60 backdrop-blur rounded-xl border border-gray-800 overflow-hidden">
              <ContestHeader contest={c} />
            </div>

            {/* Description below header - plain */}
            <div className="px-1">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{c.description}</p>
            </div>

            {/* Timer and Button side-by-side (half-half) */}
            {(c.state === ContestState.UPCOMING ||
              c.state === ContestState.REGISTRATION_OPEN ||
              c.state === ContestState.ACTIVE) && (
              <div className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="flex flex-col justify-center lg:items-start items-center lg:max-w-md w-full mx-auto">
                  <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                    {c.state === ContestState.ACTIVE ? 'Contest Ends In' : 'Contest Starts In'}
                  </h3>
                  <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto lg:mx-0 w-full">
                    {Object.entries(countdown).map(([unit, value]) => (
                      <div key={unit} className="text-center">
                        <div className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                          <div className="text-2xl font-bold">{value}</div>
                          <div className="text-[10px] tracking-wider text-gray-400 uppercase">{unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-end">
                  <div className="w-full">
                    <ContestActionButton
                      contest={c}
                      isRegistering={isRegistering}
                      handleRegister={handleRegister}
                      handleEnterContest={handleEnterContest}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Plain timing details (no box) */}
            <div className="px-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-play text-green-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">Starts</div>
                    <div className="text-sm text-gray-200">{formatDate(c.startTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-flag-checkered text-red-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">Ends</div>
                    <div className="text-sm text-gray-200">{formatDate(c.endTime)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-user-check text-blue-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">Registration</div>
                    <div className="text-sm text-gray-200">{formatDate(c.registrationDeadline)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coin rewards moved to left bottom, plain and compact */}
            <div className="px-1">
              <CoinRewards contest={c} compact />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:h-full">
            <div className="flex-1 flex flex-col min-h-0 px-1">
              <div className="flex items-center justify-center mb-4">
                <i className="fas fa-trophy w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-xl font-bold text-center">Leaderboard</h3>
              </div>
              {/* Highlighting is done inline on the user's card with crown+border */}
              {isContestNotStarted ? (
                <div className="rounded-lg p-12 text-center border-2 border-dashed border-gray-800">
                  <i className="fas fa-trophy w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">Contest Not Started</h4>
                  <p className="text-gray-400">Leaderboard will be available once the contest begins</p>
                </div>
              ) : lb && lb.rankings && lb.rankings.length > 0 ? (
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0" style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}>
                    {lb.rankings.map((entry: any) => (
                      <LeaderboardEntry key={entry.userId || `${entry.username}-${entry.rank}`} entry={entry} />
                    ))}
                </div>
              ) : (
                <div className="rounded-lg p-8 text-center">
                  <i className="fas fa-users w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No participants yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="bg-gray-900/60 backdrop-blur rounded-xl border border-gray-800 p-5">
            <ContestRules contest={c} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestInfoPage;