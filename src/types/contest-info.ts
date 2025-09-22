



export const ContestState = {
  UPCOMING: 'upcoming',
  REGISTRATION_OPEN: 'registration_open',
  ACTIVE: 'active',
  ENDED: 'ended',
  RESULTS_PUBLISHED: 'results_published',
};

export const ParticipantStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DISQUALIFIED: 'disqualified',
};

export const Contest = {
  id: String,
  contestNumber: Number,
  title: String,
  description: String,
  thumbnail: String,
  startTime: Date,
  endTime: Date,
  registrationDeadline: Date,
  totalParticipants: Number,
  maxReward: Number,
  state: String,
  isRegistered: Boolean,
  canRegister: Boolean,
  timeRemaining: Number,
};

export const ContestData = {
  id: String,
  contestNumber: Number,
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  thumbnail: String,
  registrationDeadline: Date,
  problemTimeLimit: Number,
  maxAttempts: Number,
  wrongSubmissionPenalty: Number,
  coinRewards: [{ rank: Number, coins: Number }],
  state: String,
  isUserRegistered: Boolean,
  userSubmission: {
    status: String,
    testCasesPassed: Number,
    totalTestCases: Number,
    submittedAt: Date,
  },
};

export const LeaderboardEntry = {
  rank: Number,
  userId: String,
  username: String,
  profileImage: String,
  totalScore: Number,
  timeTaken: Number,
  attempts: Number,
  status: String,
  coinsEarned: Number,
  isCurrentUser: Boolean,
};

export const ContestLeaderboard = {
  contestId: String,
  rankings: [LeaderboardEntry],
  totalParticipants: Number,
  lastUpdated: Date,
  userRank: Number,
};

export const UserContestStats = {
  totalContestsParticipated: Number,
  bestRank: Number,
  totalCoinsEarned: Number,
  averageRank: Number,
};