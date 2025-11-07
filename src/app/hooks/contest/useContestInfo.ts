import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ContestService from '../../../services/axios/user/contest-info';
import { mapContestResponseToDTO } from '../../../utils/mappers/contestMapper';
import type { ContestDTO } from '../../../types/contest.dto';
import { ContestState } from '../../../types/contest-info';

export const useContestInfo = () => {
  const { contestNumber } = useParams();
  const [contest, setContest] = useState<ContestDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const hasRefetchedOnZero = useRef(false);

  const fetchContestData = useCallback(async () => {
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
  }, [contestNumber]);

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

  const handleEnterContest = () => {
    if (!contest || !contestNumber) return;
    try {
      window.sessionStorage.setItem(`contest:${contestNumber}:entered`, '1');
    } catch {
      // Ignore sessionStorage errors
    }
  };

  // Timer effect
  useEffect(() => {
    if (!contest) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const targetDate =
      contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN
        ? contest.startTime
        : contest.endTime;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  // Refetch when countdown reaches zero
  useEffect(() => {
    if (!contest) return;
    const isZero =
      countdown.days === 0 &&
      countdown.hours === 0 &&
      countdown.minutes === 0 &&
      countdown.seconds === 0;
    
    if (isZero && !hasRefetchedOnZero.current) {
      hasRefetchedOnZero.current = true;
      fetchContestData();
    }
    
    if (!isZero) {
      hasRefetchedOnZero.current = false;
    }
  }, [countdown.days, countdown.hours, countdown.minutes, countdown.seconds, contest, fetchContestData]);

  useEffect(() => {
    if (contestNumber) {
      fetchContestData();
    }
  }, [contestNumber, fetchContestData]);

  const isContestNotStarted =
    contest?.state === ContestState.UPCOMING || contest?.state === ContestState.REGISTRATION_OPEN;

  return {
    contest,
    isLoading,
    isRegistering,
    error,
    countdown,
    isContestNotStarted,
    handleRegister,
    handleEnterContest,
    refetchContest: fetchContestData,
  };
};