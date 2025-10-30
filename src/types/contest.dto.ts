export type ContestRewardDTO = {
  rank: number;
  coins: number;
};

export type ContestDTO = {
  id: string;
  contestNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  startTime: Date;
  endTime: Date;
  registrationDeadline: Date;
  problemTimeLimit: number;
  maxAttempts: number;
  wrongSubmissionPenalty: number;
  coinRewards: ContestRewardDTO[];
  state: 'upcoming' | 'registration_open' | 'active' | 'ended' | 'results_published';
  participantsCount: number;
  isUserRegistered: boolean;
  isParticipantCompleted: boolean;
  canContinue?: boolean;
  canRegister: boolean;
  canEnter: boolean;
};


