
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContestService from '../../../services/axios/user/contest-info';
import { mapContestResponseToDTO } from '../../../utils/mappers/contestMapper';
import type { ContestDTO } from '../../../types/contest.dto';

export const useContestInfo = () => {
  const { contestNumber } = useParams();
  const [contest, setContest] = useState<ContestDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContestData = async () => {
    if (!contestNumber) return;
    try {
      setIsLoading(true);
      setError(null);
      const resp = await ContestService.fetchContestData(contestNumber);
      // Expecting resp.data.contest per provided API example
      const apiContest = (resp?.data?.contest) ?? resp?.contest ?? resp;
      const mapped = mapContestResponseToDTO(apiContest);
      setContest(mapped);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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
        // setContest((prev) => (prev ? { ...prev, isUserRegistered: true, canRegister: false, canEnter: prev.state === 'active' } : null));
        const resp = await ContestService.fetchContestData(contestNumber);
        // Expecting resp.data.contest per provided API example
        const apiContest = (resp?.data?.contest) ?? resp?.contest ?? resp;
        const mapped = mapContestResponseToDTO(apiContest);
        setContest(mapped);
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

  return { contest, isLoading, isRegistering, error, handleRegister, refetchContest: fetchContestData };
};