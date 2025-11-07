

import { useState, useEffect } from 'react';
import ContestService from '../../../services/axios/user/contest';
import { ContestLeaderboard } from '../../../types/contest';

export const useLeaderboard = (contestNumber: number) => {
  const [leaderboard, setLeaderboard] = useState<typeof ContestLeaderboard | null>(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const fetchLeaderboard = async () => {
    if (!contestNumber) return;
    setLoadingLeaderboard(true);
    const data = await ContestService.fetchLeaderboard(contestNumber);
    setLeaderboard(data);
    setLoadingLeaderboard(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [contestNumber]);

  return { leaderboard, loadingLeaderboard };
};