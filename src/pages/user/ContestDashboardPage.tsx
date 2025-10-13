


import React, { useState } from 'react';
import { Clock, Trophy, Calendar, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');

  const {
    activeContest,
    filteredUpcoming,
    pastContests,
    searchTerm,
    setSearchTerm,
    loadingActive,
    loadingUpcoming,
    loadingPast,
    handleRegisterForContest,
  } = useContests();

  const { leaderboard, loadingLeaderboard } = useLeaderboard(
    activeContest.length > 0 ? activeContest[0].contestNumber : null
  );

  const timeLeft = useContestTimer(activeContest);

  return (
    <div className="bg-black text-white flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <img src={trophy} alt="Trophy" className="w-100 h-100 mb-1" />
          <img src={contestText} alt="Contest Text" className="w-80 h-auto mb-4" />
          <h1 className="text-3xl md:text-lg font-extrabold text-green-700 tracking-tight drop-shadow-lg animate-pulse">
            Contest every day, compete and see your ranking
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-3 space-y-8">
            <div>
              {loadingActive ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-3 text-gray-400">Loading active contests...</span>
                </div>
              ) : activeContest.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No Active Contests</h3>
                  <p className="text-gray-500">Check back later for upcoming contests</p>
                </div>
              ) : (
                <div className="flex justify-center gap-6 flex-wrap">
                  {activeContest.slice(0, 2).map((contest) => (
                    <ActiveContestCard contest={contest} timeLeft={timeLeft} />
                  ))}
                </div>
              )}
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3 bg-gray-900 rounded-lg border border-gray-800 p-6 min-h-[600px]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`text-xl font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'upcoming' ? 'text-green-400 bg-gray-800' : 'text-gray-400 hover:text-green-400'
                          }`}
                      >
                        Upcoming Contests
                      </button>
                      <button
                        onClick={() => setActiveTab('past')}
                        className={`text-xl font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'past' ? 'text-green-400 bg-gray-800' : 'text-gray-400 hover:text-green-400'
                          }`}
                      >
                        Past Contests
                      </button>
                    </div>
                    {activeTab === 'upcoming' && (
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search contests..."
                        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    )}
                  </div>

                  {activeTab === 'upcoming' ? (
                    loadingUpcoming ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-6 animate-pulse">
                            <div className="flex space-x-4">
                              <div className="w-24 h-16 bg-gray-700 rounded"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredUpcoming.map((contest) => (
                          <ContestListItem
                            key={contest.id}
                            contest={contest}
                            isPast={false}
                            onRegister={handleRegisterForContest}
                          />
                        ))}
                        {filteredUpcoming.length === 0 && !loadingUpcoming && (
                          <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-400 mb-2">No Upcoming Contests</h3>
                            <p className="text-gray-500">
                              {searchTerm ? 'No contests match your search' : 'New contests will appear here'}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      {loadingPast ? (
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                          <LoadingSpinner />
                        </div>
                      ) : (
                        pastContests.map((contest) => (
                          <ContestListItem
                            key={contest.id}
                            contest={contest}
                            isPast={true}
                            onRegister={() => { }}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 min-h-[600px]">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-green-400 flex items-center justify-center text-center">
                        <Trophy className="h-5 w-5 mr-2" />
                        Live Leaderboard
                      </h3>
                      {activeContest.length > 0 && (
                        <p className="text-white text-sm mt-1 text-center">{activeContest[0].title}</p>
                      )}
                    </div>
                    {loadingLeaderboard ? (
                      <div className="text-center py-8">
                        <LoadingSpinner />
                        <p className="text-gray-400">Loading leaderboard...</p>
                      </div>
                    ) : leaderboard && leaderboard.rankings.length > 0 ? (
                      <div className="space-y-2">
                        {leaderboard.rankings.slice(0, 20).map((entry) => (
                          <LeaderboardEntry entry={entry} />
                        ))}
                        {leaderboard.userRank && leaderboard.userRank > 20 && (
                          <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg mt-2">
                            <div className="text-center">
                              <p className="text-green-400 font-medium">Your Rank: #{leaderboard.userRank}</p>
                              <p className="text-gray-400 text-xs">out of {leaderboard.totalParticipants}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        {activeContest.length > 0 ? (
                          <>
                            <Trophy className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-400">No participants yet</p>
                          </>
                        ) : (
                          <>
                            <Timer className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-400">No active contest</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestDashboardPage;