import { ContestState } from '../../types/contest-info';
import ContestTimerSection from './ContestTimerSection';
import ContestActionButton from './ContestActionButton';
import type { ContestDTO } from '../../types/contest.dto';

interface ContestTimerAndActionProps {
  contest: ContestDTO & {
    userSubmission?: {
      status: string;
      testCasesPassed: number;
      totalTestCases: number;
      submittedAt: Date;
    };
  };
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  isRegistering: boolean;
  handleRegister: () => void;
  handleEnterContest: () => void;
}

const ContestTimerAndAction = ({
  contest,
  countdown,
  isRegistering,
  handleRegister,
  handleEnterContest,
}: ContestTimerAndActionProps) => {
  const showTimer =
    contest.state === ContestState.UPCOMING ||
    contest.state === ContestState.REGISTRATION_OPEN ||
    contest.state === ContestState.ACTIVE;

  if (!showTimer) return null;

  const timerTitle = contest.state === ContestState.ACTIVE ? 'Contest Ends In' : 'Contest Starts In';

  return (
    <div className="px-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <ContestTimerSection countdown={countdown} title={timerTitle} />
      <div className="flex items-center justify-center lg:justify-end">
        <div className="w-full">
          <ContestActionButton
            contest={contest}
            isRegistering={isRegistering}
            handleRegister={handleRegister}
            handleEnterContest={handleEnterContest}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestTimerAndAction;

