import { useState, useEffect, useCallback } from 'react';
import ContestService from '../../../services/axios/user/contest';
import { ContestState } from '../../../types/contest-info';
import type { ContestDTO } from '../../../types/contest.dto';

export const useLeaderboardRefresh = (contest: ContestDTO | null) => {
  const [leaderboard, setLeaderboard] = useState(null);

  const fetchLeaderboardData = useCallback(async () => {
    if (!contest || !contest.contestNumber) return;
    const data = await ContestService.fetchLeaderboard(contest.contestNumber);
    setLeaderboard(data);
  }, [contest?.contestNumber]); // Only depend on contestNumber, not entire contest object

  useEffect(() => {
    if (contest?.contestNumber) {
      fetchLeaderboardData();
    }
  }, [contest?.contestNumber, fetchLeaderboardData]); // Use contestNumber instead of contest

  useEffect(() => {
    if (contest?.state === ContestState.ACTIVE && contest?.contestNumber) {
      const interval = setInterval(fetchLeaderboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [contest?.state, contest?.contestNumber, fetchLeaderboardData]);

  return leaderboard;
};