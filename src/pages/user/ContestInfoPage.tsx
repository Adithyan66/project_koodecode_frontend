
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import ContestHeader from '../../components/contestInfo/ContestHeader';
import ContestDescription from '../../components/contestInfo/ContestDescription';
import ContestTimerAndAction from '../../components/contestInfo/ContestTimerAndAction';
import ContestTimingDetails from '../../components/contestInfo/ContestTimingDetails';
import CoinRewards from '../../components/contestInfo/CoinRewards';
import ContestRules from '../../components/contestInfo/ContestRules';
import ContestLeaderboard from '../../components/contestInfo/ContestLeaderboard';
import ContestInfoShimmer from '../../components/contestInfo/ContestInfoShimmer';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { useContestInfo } from '../../app/hooks/contest/useContestInfo';
import { useLeaderboardRefresh } from '../../app/hooks/contest/useLeaderboardRefresh';

const ContestInfoPage = () => {
  const navigate = useNavigate();
  const { contestNumber } = useParams();
  const {
    contest,
    isLoading,
    isRegistering,
    error,
    countdown,
    isContestNotStarted,
    handleRegister,
    handleEnterContest: handleEnterContestStorage,
  } = useContestInfo();
  const leaderboard = useLeaderboardRefresh(contest);

  const handleEnterContest = () => {
    if (!contestNumber) return;
    handleEnterContestStorage();
    navigate(`/contest/${contestNumber}/participate`, { state: { fromEnter: true } });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <ContestInfoShimmer />
      </>
    );
  }

  if (error && !contest) {
    return (
      <>
        <Navbar />
        <ErrorDisplay
          title="Error Loading Contest"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </>
    );
  }

  if (!contest) {
    return (
      <>
        <Navbar />
        <ContestInfoShimmer />
      </>
    );
  }

  const c = contest as any;

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

            <ContestDescription description={c.description} />

            <ContestTimerAndAction
              contest={c}
              countdown={countdown}
              isRegistering={isRegistering}
              handleRegister={handleRegister}
              handleEnterContest={handleEnterContest}
            />

            <ContestTimingDetails
              startTime={c.startTime}
              endTime={c.endTime}
              registrationDeadline={c.registrationDeadline}
            />

            <div className="px-1">
              <CoinRewards contest={c} compact />
            </div>
          </div>

          <ContestLeaderboard isContestNotStarted={isContestNotStarted} leaderboard={leaderboard} />
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