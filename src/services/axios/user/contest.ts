


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

  async fetchPastContests() {
    try {
      const response = await httpClient.get('/user/contests/state/past');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching past contests:', error);
      return [];
    }
  }

  async fetchLeaderboard(contestNumber) {
    try {
      const response = await httpClient.get(`/user/contests/${contestNumber}/leaderboard`);
      return response.data.leaderboard || null;
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