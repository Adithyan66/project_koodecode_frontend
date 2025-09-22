
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

export const LeaderboardEntry = {
  rank: Number,
  username: String,
  profileImage: String,
  totalScore: Number,
  timeTaken: String,
  attempts: Number,
  status: String,
  coinsEarned: Number,
  isCurrentUser: Boolean,
};

export const ContestLeaderboard = {
  contestId: String,
  rankings: [LeaderboardEntry],
  totalParticipants: Number,
  userRank: Number,
};

export const UserContestStats = {
  totalContestsParticipated: Number,
  bestRank: Number,
  totalCoinsEarned: Number,
  averageRank: Number,
};