import { useState, useEffect } from 'react';
import ContestService from '../../../services/axios/user/contest';
import { ContestState } from '../../../types/contest-info';
import type { ContestDTO } from '../../../types/contest.dto';

export const useLeaderboardRefresh = (contest: ContestDTO | null) => {
  const [leaderboard, setLeaderboard] = useState(null);

  const fetchLeaderboardData = async () => {
    if (!contest || !contest.contestNumber) return;
    const data = await ContestService.fetchLeaderboard(contest.contestNumber);
    setLeaderboard(data);
  };

  useEffect(() => {
    if (contest) {
      fetchLeaderboardData();
    }
  }, [contest]);

  useEffect(() => {
    if (contest && contest.state === ContestState.ACTIVE) {
      const interval = setInterval(fetchLeaderboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [contest?.state]);

  return leaderboard;
};