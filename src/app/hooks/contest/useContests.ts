

import { useState, useEffect } from 'react';
import ContestService from '../../../services/axios/user/contest';
import { Contest } from '../../../types/contest';
import { useDebounce } from '../../../utils/debounce';




export const useContests = () => {

  const [activeContest, setActiveContest] = useState<typeof Contest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [pastTotal, setPastTotal] = useState(0);
  const [pastPage, setPastPage] = useState(1);
  const [pastLimit, setPastLimit] = useState(5);
  const [pastTotalPages, setPastTotalPages] = useState(1);
  const [pastSearch, setPastSearch] = useState('');
  const [filteredUpcoming, setFilteredUpcoming] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingPast, setLoadingPast] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const fetchActiveContest = async () => {
    setLoadingActive(true);
    const data = await ContestService.fetchActiveContest();
    setActiveContest(data.contests);
    setLoadingActive(false);
  };

  const fetchUpcomingContests = async () => {
    setLoadingUpcoming(true);
    const data = await ContestService.fetchUpcomingContests();
    setUpcomingContests(data.contests);
    setFilteredUpcoming(data.contests);
    setLoadingUpcoming(false);
  };

  const fetchPastContests = async (page = pastPage, limit = pastLimit, search = pastSearch) => {
    if (loadingPast) return;
    setLoadingPast(true);
    const data = await ContestService.fetchPastContests({ page, limit, search });
    setPastContests(data.contests || []);
    setPastTotal(data.total || 0);
    setPastPage(data.page || page);
    setPastLimit(data.limit || limit);
    setPastTotalPages(data.totalPages || Math.max(1, Math.ceil((data.total || 0) / (data.limit || limit))));
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
    fetchPastContests(1, pastLimit, '');
    // fetchUserStats();
  }, []);

  useEffect(() => {
    fetchPastContests(pastPage, pastLimit, pastSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastPage, pastLimit, pastSearch]);

  // useEffect(() => {
  //   filterContests(searchTerm);
  // }, [searchTerm, filterContests]);

  return {
    activeContest,
    upcomingContests,
    pastContests,
    filteredUpcoming,
    loadingActive,
    loadingUpcoming,
    loadingPast,
    userStats,
    handleRegisterForContest,
    fetchPastContests,
    pastPage,
    setPastPage,
    pastTotal,
    pastTotalPages,
    pastLimit,
    setPastLimit,
    pastSearch,
    setPastSearch,
  };
};