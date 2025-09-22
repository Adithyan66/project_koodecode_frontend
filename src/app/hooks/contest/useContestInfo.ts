
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContestService from '../../../services/axios/user/contest-info';
import { ContestData } from '../../../types/contest-info';

export const useContestInfo = () => {
  const { contestNumber } = useParams();
  const [contest, setContest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const fetchContestData = async () => {
    if (!contestNumber) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await ContestService.fetchContestData(contestNumber);
      setContest(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!contestNumber || !contest) return;
    try {
      setIsRegistering(true);
      setError(null);
      const success = await ContestService.registerForContest(contest.id);
      if (success) {
        setContest((prev) => (prev ? { ...prev, isUserRegistered: true } : null));
      }
    } catch (error) {
      setError('Failed to register for contest');
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    if (contestNumber) {
      fetchContestData();
    }
  }, [contestNumber]);

  return { contest, isLoading, isRegistering, error, handleRegister };
};