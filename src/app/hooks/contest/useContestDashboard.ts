

// import { useState, useEffect } from 'react';
// import { Contest, ContestLeaderboard, UserContestStats } from '../../../types/contest';
// import httpClient from '../../../services/axios/httpClient';

// export const useContestDashboard = () => {
//   const [activeContest, setActiveContest] = useState<Contest[]>([]);
//   const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
//   const [pastContests, setPastContests] = useState<Contest[]>([]);
//   const [leaderboard, setLeaderboard] = useState<ContestLeaderboard | null>(null);
//   const [userStats, setUserStats] = useState<UserContestStats | null>(null);
  
//   // Loading states
//   const [loadingActive, setLoadingActive] = useState(true);
//   const [loadingUpcoming, setLoadingUpcoming] = useState(true);
//   const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
//   const [loadingPast, setLoadingPast] = useState(false);

//   const fetchActiveContest = async () => {
//     try {
//       const response = await httpClient.get('/user/contests/state/active');
//       setActiveContest(response.data.data);
//       if (response.data.data.length > 0) {
//         fetchLeaderboard(response.data.data[0].contestNumber);
//       }
//     } catch (error) {
//       console.error('Error fetching active contest:', error);
//     } finally {
//       setLoadingActive(false);
//     }
//   };

//   const fetchUpcomingContests = async () => {
//     try {
//       const response = await httpClient.get('/user/contests/state/upcoming');
//       setUpcomingContests(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching upcoming contests:', error);
//     } finally {
//       setLoadingUpcoming(false);
//     }
//   };

 
//   const fetchLeaderboard = async (contestNumber: number) => {
//     try {
//       setLoadingLeaderboard(true)
//       const response = await httpClient.get(`/user/contests/${contestNumber}/leaderboard`);

//       console.log("leaderboartd", response.data.leaderboard.rankings);

//       setLeaderboard(response.data.leaderboard);

//     } catch (error) {

//       console.error('Error fetching leaderboard:', error);

//     } finally {
//       setLoadingLeaderboard(false);
//     }
//   };

//   const fetchUserStats = async () => {
//     try {
//       //   const response = await httpClient.get('/api/user/contest-stats');
//       const response = mockApiResponses.getUserStats()
//       setUserStats(response.data.data);
//     } catch (error) {
//       console.error('Error fetching user stats:', error);
//     }
//   };

//   const fetchPastContests = async () => {
//     if (loadingPast) return;

//     setLoadingPast(true);
//     try {
//       const response = await httpClient.get('/user/contests/state/past');
//       console.log("passssssssssssssssssssstttttttttttttt", response.data.data);

//       setPastContests(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching past contests:', error);
//     } finally {
//       setLoadingPast(false);
//     }
//   };


//   useEffect(() => {
//     fetchActiveContest();
//     fetchUpcomingContests();
//     fetchUserStats();
//   }, []);

//   return {
//     // Data
//     activeContest,
//     upcomingContests,
//     pastContests,
//     leaderboard,
//     userStats,
    
//     // Loading states
//     loadingActive,
//     loadingUpcoming,
//     loadingLeaderboard,
//     loadingPast,
    
//     // Actions
//     fetchActiveContest,
//     fetchUpcomingContests,
//     fetchPastContests,
//     fetchLeaderboard,
//     fetchUserStats
//   };
// };
