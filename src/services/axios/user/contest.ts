


import httpClient from '../httpClient';
import { toast } from 'react-hot-toast';

class ContestService {
  async fetchActiveContest() {
    try {
      const response = await httpClient.get('/user/contests/state/active');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active contest:', error);
      return [];
    }
  }

  async fetchUpcomingContests() {
    try {
      const response = await httpClient.get('/user/contests/state/upcoming');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching upcoming contests:', error);
      return [];
    }
  }

  async fetchPastContests(params?: { page?: number; limit?: number; search?: string }) {
    try {
      const response = await httpClient.get('/user/contests/state/past', { params });
      return (
        response.data.data || {
          contests: [],
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.error('Error fetching past contests:', error);
      return { contests: [], total: 0, page: 1, limit: params?.limit || 10, totalPages: 1 };
    }
  }

  async fetchLeaderboard(contestNumber) {
    try {
      const response = await httpClient.get(`/user/contests/${contestNumber}/leaderboard`);
      const payload = response.data;
      // Support both { data: { leaderboard } } and { leaderboard }
      const leaderboard = payload?.data?.leaderboard ?? payload?.leaderboard ?? null;
      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return null;
    }
  }

  async fetchUserStats() {
    try {
      const response = await httpClient.get('/api/user/contest-stats');
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  async registerForContest(contestId) {
    try {
      await httpClient.post('/api/contests/register', { contestId });
      toast.success('Successfully registered for contest!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register for contest');
      return false;
    }
  }
}

export default new ContestService();