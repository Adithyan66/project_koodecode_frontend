


import { useState } from 'react';
import { Clock, Trophy, Calendar, Timer, Search, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import ActiveContestCard from '../../components/contests/ActiveContestCard';
import ContestListItem from '../../components/contests/ContestListItem';
import LeaderboardEntry from '../../components/contests/LeaderboardEntry';
import { useContests } from '../../app/hooks/contest/useContests';
import { useLeaderboard } from '../../app/hooks/contest/useLeaderboard';
import { useContestTimer } from '../../app/hooks/contest/useContestTimer';
import trophy from '../../assets/images/trophy 1.png';
import contestText from '../../assets/images/KoodeCode Contest.svg';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ContestDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [pastSearchTerm, setPastSearchTerm] = useState('');

  const {
    activeContest,
    upcomingContests,
    pastContests,
    pastPage,
    setPastPage,
    pastTotal,
    pastTotalPages,
    pastLimit,
    loadingActive,
    loadingUpcoming,
    loadingPast,
    handleRegisterForContest,
    setPastSearch,
  } = useContests();

  const { leaderboard, loadingLeaderboard } = useLeaderboard(
    activeContest.length > 0 ? activeContest[0].contestNumber : null
  );

  const timeLeft = useContestTimer(activeContest);

  const totalPages = pastTotalPages || 1;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'past') setPastPage(1);
  };

  const handlePastSearchChange = (value: string) => {
    setPastSearchTerm(value);
    setPastSearch(value);
    setPastPage(1);
  };

  const getActiveContestGridClass = () => {
    const count = activeContest.length;
    if (count === 1) return 'grid grid-cols-1 justify-items-center max-w-2xl mx-auto';
    if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto';
    if (count === 3) return 'grid gap-6';
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <img src={trophy} alt="Trophy" className="w-16 h-16 mb-3 animate-bounce" />
          <img src={contestText} alt="Contest Text" className="w-80 h-auto mb-3" />
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            Contest every day, compete and see your ranking
          </h1>
        </div>

        <div className="mb-12">
          {loadingActive ? (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-12 flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-3 text-gray-400">Loading active contests...</span>
            </div>
          ) : activeContest.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
              <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No Active Contests</h3>
              <p className="text-gray-500">Check back later for upcoming contests</p>
            </div>
          ) : activeContest.length === 3 ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <ActiveContestCard contest={activeContest[0]} timeLeft={timeLeft} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActiveContestCard contest={activeContest[1]} timeLeft={timeLeft} />
                <ActiveContestCard contest={activeContest[2]} timeLeft={timeLeft} />
              </div>
            </div>
          ) : (
            <div className={getActiveContestGridClass()}>
              {activeContest.map((contest, index) => (
                <ActiveContestCard key={index} contest={contest} timeLeft={timeLeft} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-6">
              <div className="flex items-center gap-4 whitespace-nowrap">
                <button
                  onClick={() => handleTabChange('upcoming')}
                  className={`relative px-6 py-3 font-bold text-lg rounded-xl transition-all duration-300 ${
                    activeTab === 'upcoming'
                      ? 'text-green-400 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 shadow-lg shadow-green-500/20'
                      : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50'
                  }`}
                >
                  {activeTab === 'upcoming' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-sm"></span>
                  )}
                  <span className="relative flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange('past')}
                  className={`relative px-6 py-3 font-bold text-lg rounded-xl transition-all duration-300 ${
                    activeTab === 'past'
                      ? 'text-green-400 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 shadow-lg shadow-green-500/20'
                      : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50'
                  }`}
                >
                  {activeTab === 'past' && (
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-sm"></span>
                  )}
                  <span className="relative flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Past
                  </span>
                </button>
              </div>
              <div className="justify-self-end w-[320px] min-h-[48px] flex items-center">
                {activeTab === 'past' ? (
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={pastSearchTerm}
                      onChange={(e) => handlePastSearchChange(e.target.value)}
                      placeholder="Search past contests..."
                      className="w-[320px] pl-10 pr-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>
                ) : (
                  <div className="w-[320px] h-[48px]"></div>
                )}
              </div>
            </div>

            <div className="space-y-4 max-w-2xl w-full mx-auto">
              {activeTab === 'upcoming' ? (
                loadingUpcoming ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 animate-pulse">
                        <div className="flex space-x-4">
                          <div className="w-24 h-16 bg-gray-700 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (upcomingContests || []).length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Upcoming Contests</h3>
                    <p className="text-gray-500">New contests will appear here</p>
                  </div>
                ) : (
                  (upcomingContests || []).map((contest, index) => (
                    <div key={index} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10">
                      <ContestListItem
                        contest={contest}
                        isPast={false}
                        onRegister={handleRegisterForContest}
                      />
                    </div>
                  ))
                )
              ) : (
                <>
                  {loadingPast ? (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8 flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : pastContests.length === 0 ? (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-12 text-center">
                      <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-300 mb-2">No Past Contests</h3>
                      <p className="text-gray-500">
                        {pastSearchTerm ? 'No contests match your search' : 'Completed contests will appear here'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {pastContests.map((contest, index) => (
                        <div key={index} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10">
                          <ContestListItem
                            contest={contest}
                            isPast={true}
                            onRegister={() => { }}
                          />
                        </div>
                      ))}

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700/50">
                          <div className="text-sm text-gray-400">
                            Showing {((pastPage - 1) * pastLimit) + 1} to {Math.min(pastPage * pastLimit, pastTotal)} of {pastTotal} contests
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPastPage(Math.max(1, pastPage - 1))}
                              disabled={pastPage === 1}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                                pastPage === 1
                                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-green-500/50'
                              }`}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Previous
                            </button>
                            
                            <div className="flex gap-2">
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => setPastPage(page)}
                                  className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 ${
                                    pastPage === page
                                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                                      : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-green-500/50'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => setPastPage(Math.min(totalPages, pastPage + 1))}
                              disabled={pastPage === totalPages}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                                pastPage === totalPages
                                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-green-500/50'
                              }`}
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-green-500/30 rounded-2xl p-6 shadow-2xl shadow-green-500/10">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-3 rounded-xl border border-green-500/50 mb-3">
                  <Trophy className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Live Leaderboard
                  </h3>
                </div>
                {activeContest.length > 0 && activeContest[0]?.title && (
                  <p className="text-white text-sm font-medium">{String(activeContest[0].title)}</p>
                )}
              </div>
              
              {loadingLeaderboard ? (
                <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="text-gray-400 mt-3">Loading leaderboard...</p>
                </div>
              ) : leaderboard && leaderboard.rankings.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {leaderboard.rankings.slice(0, 20).map((entry, index) => (
                    <div key={index} className="transform transition-all duration-200 hover:scale-[1.02]">
                      <LeaderboardEntry entry={entry} />
                    </div>
                  ))}
                  {leaderboard.userRank && Number(leaderboard.userRank) > 20 && (
                    <div className="sticky bottom-0 p-4 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 rounded-xl mt-4 shadow-lg">
                      <div className="text-center">
                        <p className="text-green-400 font-bold text-lg">Your Rank: #{String(leaderboard.userRank)}</p>
                        <p className="text-gray-300 text-sm">out of {String(leaderboard.totalParticipants)} participants</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  {activeContest.length > 0 ? (
                    <>
                      <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-3 animate-pulse" />
                      <p className="text-gray-400 font-medium">No participants yet</p>
                      <p className="text-gray-500 text-sm mt-1">Be the first to join!</p>
                    </>
                  ) : (
                    <>
                      <Timer className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">No active contest</p>
                      <p className="text-gray-500 text-sm mt-1">Leaderboard will appear when contest starts</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #059669);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </div>
  );
};

export default ContestDashboardPage;