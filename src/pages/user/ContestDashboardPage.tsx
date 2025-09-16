



import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import trophy from "../../assets/images/trophy 1.png"
import contestText from "../../assets/images/KoodeCode Contest.svg"
import {
  Clock,
  Users,
  Trophy,
  Play,
  Calendar,
  Target,
  Star,
  ChevronRight,
  Loader2,
  TrendingUp,
  Medal,
  Timer,
  Eye
} from 'lucide-react';
import httpClient from '../../services/axios/httpClient';
import { imageKitService } from '../../services/ImageKitService';
import Navbar from '../../components/user/Navbar.tsx';

interface Contest {
  id: string;
  contestNumber: number;
  title: string;
  description: string;
  thumbnail?: string;
  startTime: Date;
  endTime: Date;
  registrationDeadline: Date;
  totalParticipants: number;
  maxReward: number;
  state: string;
  isRegistered: boolean;
  canRegister: boolean;
  timeRemaining?: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  profileImage?: string;
  totalScore: number;
  timeTaken: string;
  attempts: number;
  status: string;
  coinsEarned?: number;
  isCurrentUser?: boolean;
}

interface ContestLeaderboard {
  contestId: string;
  rankings: LeaderboardEntry[];
  totalParticipants: number;
  userRank?: number;
}

interface UserContestStats {
  totalContestsParticipated: number;
  bestRank: number;
  totalCoinsEarned: number;
  averageRank: number;
}







const ContestDashboardPage: React.FC = () => {



  const navigate = useNavigate();

  // State management
  const [activeContest, setActiveContest] = useState<Contest[] | null>(null);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [pastContests, setPastContests] = useState<Contest[]>([]);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboard | null>(null);
  const [userStats, setUserStats] = useState<UserContestStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUpcoming, setFilteredUpcoming] = useState<Contest[]>([]);

  // Loading states
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [loadingPast, setLoadingPast] = useState(false);

  // UI states
  // const [showPastContests, setShowPastContests] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Fetch data on component mount
  useEffect(() => {
    fetchActiveContest();
    fetchUpcomingContests();
    fetchPastContests()
    fetchUserStats();
  }, []);

  // Setup WebSocket connection for real-time leaderboard updates
  useEffect(() => {
    if (activeContest) {
      fetchLeaderboard(activeContest.id);

      // Setup WebSocket connection (you'll need to implement this)
      const ws = new WebSocket(`ws://localhost:3000/contests/${activeContest.id}/leaderboard`);

      ws.onmessage = (event) => {
        const updatedLeaderboard = JSON.parse(event.data);
        setLeaderboard(updatedLeaderboard);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        ws.close();
      };
    }
  }, [activeContest]);

  // Timer for active contest
  useEffect(() => {
    if (activeContest && activeContest.state === 'active') {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(activeContest.endTime).getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeLeft('Contest Ended');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeContest]);

  // Filter upcoming contests with throttling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredUpcoming(upcomingContests);
      } else {
        const filtered = upcomingContests.filter(contest =>
          contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUpcoming(filtered);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, upcomingContests]);

  const fetchActiveContest = async () => {
    try {
      const response = await httpClient.get('/user/contests/state/active');
      setActiveContest(response.data.data || null);
    } catch (error) {
      console.error('Error fetching active contest:', error);
    } finally {
      setLoadingActive(false);
    }
  };

  const fetchUpcomingContests = async () => {
    try {
      const response = await httpClient.get('/user/contests/state/upcoming');
      // const response = mockApiResponses.getUpcomingContests()
      console.log("ummddddddddddddddddddddddddddddooooooooooo", response.data.data);

      setUpcomingContests(response.data.data || []);
      setFilteredUpcoming(response.data.data || []);
    } catch (error) {
      console.error('Error fetching upcoming contests:', error);
    } finally {
      setLoadingUpcoming(false);
    }
  };

  const fetchLeaderboard = async (contestId: string) => {
    try {
      //   const response = await httpClient.get(`/api/contests/${contestId}/leaderboard`);
      const response = mockApiResponses.getLeaderboard("hih")
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      //   const response = await httpClient.get('/api/user/contest-stats');
      const response = mockApiResponses.getUserStats()
      setUserStats(response.data.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchPastContests = async () => {
    if (loadingPast) return;

    setLoadingPast(true);
    try {
      const response = await httpClient.get('/user/contests/state/past');
      // const response = mockApiResponses.getPastContests()
      console.log("passssssssssssssssssssstttttttttttttt", response.data.data);

      setPastContests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching past contests:', error);
    } finally {
      setLoadingPast(false);
    }
  };

  const handleRegisterForContest = async (contestId: string) => {
    try {
      await httpClient.post('/api/contests/register', { contestId });
      toast.success('Successfully registered for contest!');
      fetchUpcomingContests(); // Refresh data
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register for contest');
    }
  };

  const handleJoinContest = (contestId: string) => {
    navigate(`/contests/${contestId}/problem`);
  };

  // const handleViewPastContests = () => {
  //   if (!showPastContests && pastContests.length === 0) {
  //     fetchPastContests();
  //   }
  //   setShowPastContests(!showPastContests);
  // };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContestThumbnail = (thumbnailKey?: string) => {
    if (thumbnailKey) {
      return imageKitService.getProfileImageUrl(thumbnailKey, 400, 200, { radius: "8" });
    }
    return '/default-contest-thumbnail.jpg'; // fallback image
  };

  return (
    // <div className="min-h-screen bg-black text-white">
    <div className=" bg-black text-white flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col items-center justify-center  text-center ">
          <img src={trophy} alt="Trophy" className="w-100 h-100 mb-1" />
          <img src={contestText} alt="Contest Text" className="w-80 h-auto mb-4" />
          <h1 className="text-3xl md:text-lg font-extrabold text-green-700 tracking-tight drop-shadow-lg animate-pulse">
            Contest every day, compete and see your ranking
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              {loadingActive ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-green-400" />
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
                    <div
                      key={contest.id}
                      onClick={() => navigate(`/contest/${contest.contestNumber}`)}
                      className={`bg-gray-900 border hover:cursor-pointer border-gray-800 rounded-lg overflow-hidden ${activeContest.length === 1 ? 'w-full max-w-xl' : 'w-full max-w-md'
                        }`}
                    >
                      <div className="relative"
                      // onClick={() => handleJoinContest(contest.id)}
                      >
                        <img
                          src={getContestThumbnail(contest.thumbnail)}
                          alt={contest.title}
                          className="w-full h-68 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          LIVE
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{contest.title}</h3>
                            {/* <p className="text-gray-400 text-sm">{contest.description}</p> */}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-400">
                              {formatTime(contest.timeRemaining)}
                            </div>
                            <p className="text-gray-400 text-sm">Time Remaining</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-gray-400">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{contest.totalParticipants} participants</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Trophy className="h-4 w-4 mr-2" />
                            <span>{contest.maxReward} coins prize</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>





            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="grid grid-cols-5 gap-6">
                {/* Contests Section (3/5) */}
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
                          <div
                            key={contest.id}
                            onClick={() => navigate(`/contest/${contest.contestNumber}`)}
                            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                            <div className="flex space-x-4">
                              <img
                                src={getContestThumbnail(contest.thumbnail)}
                                alt={contest.title}
                                className="w-24 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-semibold text-white">{contest.title}</h3>
                                  <div className="text-right">
                                    <div className="text-green-400 font-medium">{contest.maxReward} coins</div>
                                    <div className="text-gray-400 text-sm">Max reward</div>
                                  </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{contest.description}</p>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatTime(contest.startTime.toString())}
                                    </div>
                                    <div className="flex items-center">
                                      <Users className="h-4 w-4 mr-1" />
                                      {contest.totalParticipants} registered
                                    </div>
                                  </div>
                                  {contest.isRegistered ? (
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                      Registered
                                    </span>
                                  ) : contest.canRegister ? (
                                    <button
                                      onClick={() => handleRegisterForContest(contest.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                      Register
                                    </button>
                                  ) : (
                                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                                      Registration Closed
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
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
                          <Loader2 className="h-6 w-6 animate-spin text-green-400 mx-auto" />
                        </div>
                      ) : (
                        pastContests.map((contest) => (
                          <div
                            onClick={() => navigate(`/contest/${contest.contestNumber}`)}
                            key={contest.id}
                            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                            <div className="flex space-x-4">
                              <img
                                src={getContestThumbnail(contest.thumbnail)}
                                alt={contest.title}
                                className="w-24 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-semibold text-white">{contest.title}</h3>
                                  <button
                                    onClick={() => navigate(`/contests/${contest.id}/results`)}
                                    className="flex items-center text-green-400 hover:text-green-300 transition-colors"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Results
                                  </button>
                                </div>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{contest.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatTime(contest.startTime.toString())}
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {contest.totalParticipants} registered
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Leaderboard Section (2/5) */}
                <div className="col-span-2">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 min-h-[600px]">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-green-400 flex items-center">
                        <Trophy className="h-5 w-5 mr-2" />
                        Live Leaderboard
                      </h3>
                      {activeContest && (
                        <p className="text-gray-400 text-sm mt-1">{activeContest.title}</p>
                      )}
                    </div>
                    {loadingLeaderboard ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-green-400 mx-auto mb-2" />
                        <p className="text-gray-400">Loading leaderboard...</p>
                      </div>
                    ) : leaderboard && leaderboard.rankings.length > 0 ? (
                      <div className="space-y-2">
                        {leaderboard.rankings.slice(0, 20).map((entry) => (
                          <div
                            key={entry.rank}
                            className={`p-3 border border-gray-800 rounded-lg ${entry.isCurrentUser ? 'bg-green-900/20 border-green-600' : ''
                              }`}
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
                                    className={`font-medium text-sm ${entry.isCurrentUser ? 'text-green-400' : 'text-white'
                                      }`}
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
                        {activeContest ? (
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
}

export default ContestDashboardPage;
