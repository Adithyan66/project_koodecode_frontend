

import { useState, useEffect, useCallback } from 'react';
import ContestService from '../../../services/axios/user/contest';
import { Contest } from '../../../types/contest';
import { useDebounce } from '../../../utils/debounce';




export const useContests = () => {

  const [activeContest, setActiveContest] = useState<typeof Contest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [filteredUpcoming, setFilteredUpcoming] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingPast, setLoadingPast] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const fetchActiveContest = async () => {
    setLoadingActive(true);
    const data = await ContestService.fetchActiveContest();
    setActiveContest(data);
    setLoadingActive(false);
  };

  const fetchUpcomingContests = async () => {
    setLoadingUpcoming(true);
    const data = await ContestService.fetchUpcomingContests();
    setUpcomingContests(data);
    setFilteredUpcoming(data);
    setLoadingUpcoming(false);
  };

  const fetchPastContests = async () => {
    if (loadingPast) return;
    setLoadingPast(true);
    const data = await ContestService.fetchPastContests();
    setPastContests(data);
    setLoadingPast(false);
  };

  const fetchUserStats = async () => {
    const data = await ContestService.fetchUserStats();
    setUserStats(data);
  };

  const handleRegisterForContest = async (contestId: any) => {
    const success = await ContestService.registerForContest(contestId);
    if (success) {
      fetchUpcomingContests(); // Refresh upcoming contests
    }
  };


  // const filterContests = useCallback(
  //   useDebounce((term: string) => {
  //     if (!term.trim()) {
  //       setFilteredUpcoming(upcomingContests);
  //     } else {
  //       const filtered = upcomingContests.filter(
  //         (contest) =>
  //           contest.title.toLowerCase().includes(term.toLowerCase()) ||
  //           contest.description.toLowerCase().includes(term.toLowerCase())
  //       );
  //       setFilteredUpcoming(filtered);
  //     }
  //   }, 300),
  //   [upcomingContests]
  // );

  useEffect(() => {
    fetchActiveContest();
    fetchUpcomingContests();
    fetchPastContests();
    // fetchUserStats();
  }, []);

  // useEffect(() => {
  //   filterContests(searchTerm);
  // }, [searchTerm, filterContests]);

  return {
    activeContest,
    upcomingContests,
    pastContests,
    filteredUpcoming,
    searchTerm,
    setSearchTerm,
    loadingActive,
    loadingUpcoming,
    loadingPast,
    userStats,
    handleRegisterForContest,
    fetchPastContests,
  };
};