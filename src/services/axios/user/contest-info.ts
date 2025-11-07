

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

  async fetchLeaderboard(contestNumber: any) {
    try {
      const response = await httpClient.get(`/user/contests/${contestNumber}/leaderboard`);
      return {
        contestId: response.data.leaderboard.contestId,
        rankings: response.data.leaderboard.rankings.map((entry: { timeTaken: any; }) => ({
          ...entry,
          timeTaken: String(entry.timeTaken),
        })),
        totalParticipants: response.data.leaderboard.rankings.length,
        lastUpdated: new Date(response.data.leaderboard.lastUpdated),
      };
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

  async registerForContest(contestId: string) {
    try {
      await httpClient.post('/user/contests/register', { contestId });
      toast.success('Successfully registered for contest!');
      return true;
    } catch (error) {
      const message =
        (typeof error === 'object' && error !== null && 'response' in error && (error as any).response?.data?.message) ||
        'Failed to register for contest';
      toast.error(message);
      return false;
    }
  }

  async fetchContestData(contestNumber: string) {
    try {
      const response = await httpClient.get(`/user/contests/${contestNumber}`);
      return {
        ...response.data.data.contest,
        startTime: new Date(response.data.data.contest.startTime),
        endTime: new Date(response.data.data.contest.endTime),
        registrationDeadline: new Date(response.data.data.contest.registrationDeadline),
        userSubmission: response.data.data.contest.userSubmission
          ? {
            ...response.data.data.contest.userSubmission,
            submittedAt: new Date(response.data.data.contest.userSubmission.submittedAt),
          }
          : null,
      };
    } catch (error) {
      console.error('Error fetching contest data:', error);
      throw new Error('Failed to load contest data');
    }
  }
}

export default new ContestService();