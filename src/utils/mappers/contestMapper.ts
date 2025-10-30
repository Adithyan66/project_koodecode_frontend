import type { ContestDTO } from '../../types/contest.dto';

type ApiContest = {
  id: string;
  contestNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  problemTimeLimit: number;
  maxAttempts: number;
  wrongSubmissionPenalty: number;
  coinRewards: { rank: number; coins: number }[];
  state: 'upcoming' | 'registration_open' | 'active' | 'ended' | 'results_published';
  isUserRegistered?: boolean;
  isParticipantCompleted?: boolean;
  isParticipantcompleted?: boolean; // tolerate server typo/case
  participants?: string[];
  participantsCount?: number;
  canRegister?: boolean;
  canEnter?: boolean;
  canContinue?: boolean;
};

export function mapContestResponseToDTO(api: ApiContest, currentUserId?: string): ContestDTO {
  const startTime = new Date(api.startTime);
  const endTime = new Date(api.endTime);
  const registrationDeadline = new Date(api.registrationDeadline);
  const now = new Date();

  // Prefer server flags if present
  const isUserRegistered = api.isUserRegistered ?? (api.participants ? api.participants.includes(String(currentUserId || '')) : false) ?? false;

  const isParticipantCompleted = (api as any).isParticipantCompleted ?? (api as any).isParticipantcompleted ?? false;

  // Compute canRegister/canEnter if server didn't provide
  const computedCanRegister = (api.state === 'upcoming' || api.state === 'registration_open') && now <= registrationDeadline && !isUserRegistered && !isParticipantCompleted;
  const computedCanEnter = api.state === 'active' && isUserRegistered && !isParticipantCompleted;

  const participantsCount = typeof api.participantsCount === 'number' ? api.participantsCount : (api.participants ? api.participants.length : 0);

  return {
    id: api.id,
    contestNumber: api.contestNumber,
    title: api.title,
    description: api.description,
    thumbnail: api.thumbnail,
    startTime,
    endTime,
    registrationDeadline,
    problemTimeLimit: api.problemTimeLimit,
    maxAttempts: api.maxAttempts,
    wrongSubmissionPenalty: api.wrongSubmissionPenalty,
    coinRewards: api.coinRewards || [],
    state: api.state,
    participantsCount,
    isUserRegistered,
    isParticipantCompleted,
    canContinue: api.canContinue,
    canRegister: api.canRegister ?? computedCanRegister,
    canEnter: api.canEnter ?? computedCanEnter,
  };
}


