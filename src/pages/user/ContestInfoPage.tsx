




// import React, { useState, useEffect } from 'react';
// import { Clock, Users, Trophy, Star, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

// // Enums and types
// export enum ContestState {
//   UPCOMING = 'upcoming',
//   REGISTRATION_OPEN = 'registration_open',
//   ACTIVE = 'active',
//   ENDED = 'ended',
//   RESULTS_PUBLISHED = 'results_published'
// }

// export enum ParticipantStatus {
//   ACTIVE = 'active',
//   COMPLETED = 'completed',
//   DISQUALIFIED = 'disqualified'
// }

// export class ContestReward {
//   public rank: number;
//   public coins: number;

//   constructor({
//     rank,
//     coins
//   }: {
//     rank: number;
//     coins: number;
//   }) {
//     this.rank = rank;
//     this.coins = coins;
//   }
// }

export class LeaderboardEntry {
  public rank: number;
  public userId: string;
  public username: string;
  public profileImage?: string;
  public totalScore: number;
  public timeTaken: number;
  public attempts: number;
  public status: ParticipantStatus;
  public coinsEarned?: number;

  constructor({
    rank,
    userId,
    username,
    profileImage,
    totalScore,
    timeTaken,
    attempts,
    status,
    coinsEarned
  }: {
    rank: number;
    userId: string;
    username: string;
    profileImage?: string;
    totalScore: number;
    timeTaken: number;
    attempts: number;
    status: ParticipantStatus;
    coinsEarned?: number;
  }) {
    this.rank = rank;
    this.userId = userId;
    this.username = username;
    this.profileImage = profileImage;
    this.totalScore = totalScore;
    this.timeTaken = timeTaken;
    this.attempts = attempts;
    this.status = status;
    this.coinsEarned = coinsEarned;
  }
}

export class ContestLeaderboarage {
  public contestId: string;
  public rankings: LeaderboardEntry[];
  public lastUpdated: Date;

  constructor({
    contestId,
    rankings,
    lastUpdated = new Date()
  }: {
    contestId: string;
    rankings: LeaderboardEntry[];
    lastUpdated?: Date;
  }) {
    this.contestId = contestId;
    this.rankings = rankings;
    this.lastUpdated = lastUpdated;
  }

  updateRankings(newRankings: LeaderboardEntry[]): void {
    this.rankings = newRankings;
    this.lastUpdated = new Date();
  }

  getTotalParticipants(): number {
    return this.rankings.length;
  }

  getTopN(n: number): LeaderboardEntry[] {
    return this.rankings.slice(0, n);
  }
}

// // Contest data interface
// interface ContestData {
//   contestNumber: number;
//   title: string;
//   description: string;
//   startTime: Date;
//   endTime: Date;
//   thumbnail: string;
//   registrationDeadline: Date;
//   problemTimeLimit: number;
//   maxAttempts: number;
//   wrongSubmissionPenalty: number;
//   coinRewards: ContestReward[];
//   state: ContestState;
//   isUserRegistered: boolean;
// }

// // Props interface
// interface ContestInfoProps {
//   contest: ContestData;
//   leaderboard?: ContestLeaderboard;
//   onRegister: () => void;
//   onEnterContest: () => void;
//   isLoading?: boolean;
// }

// // Countdown timer hook
// const useCountdown = (targetDate: Date) => {
//   const [timeLeft, setTimeLeft] = useState<{
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
//   }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const target = targetDate.getTime();
//       const difference = target - now;

//       if (difference > 0) {
//         setTimeLeft({
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//           minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//           seconds: Math.floor((difference % (1000 * 60)) / 1000)
//         });
//       } else {
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   return timeLeft;
// };

// // Helper functions
// const getStateColor = (state: ContestState): string => {
//   switch (state) {
//     case ContestState.UPCOMING:
//       return 'bg-blue-100 text-blue-800 border-blue-200';
//     case ContestState.REGISTRATION_OPEN:
//       return 'bg-green-100 text-green-800 border-green-200';
//     case ContestState.ACTIVE:
//       return 'bg-orange-100 text-orange-800 border-orange-200';
//     case ContestState.ENDED:
//       return 'bg-red-100 text-red-800 border-red-200';
//     case ContestState.RESULTS_PUBLISHED:
//       return 'bg-purple-100 text-purple-800 border-purple-200';
//     default:
//       return 'bg-gray-100 text-gray-800 border-gray-200';
//   }
// };

// const getStateIcon = (state: ContestState) => {
//   switch (state) {
//     case ContestState.REGISTRATION_OPEN:
//       return <CheckCircle className="w-4 h-4" />;
//     case ContestState.ACTIVE:
//       return <Clock className="w-4 h-4" />;
//     case ContestState.ENDED:
//     case ContestState.RESULTS_PUBLISHED:
//       return <Trophy className="w-4 h-4" />;
//     default:
//       return <Calendar className="w-4 h-4" />;
//   }
// };

// const formatTime = (minutes: number): string => {
//   if (minutes < 60) return `${minutes}m`;
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
// };

// const formatDate = (date: Date): string => {
//   return new Intl.DateTimeFormat('en-US', {
//     dateStyle: 'medium',
//     timeStyle: 'short'
//   }).format(date);
// };

// const getRewardCardColor = (rank: number): string => {
//   if (rank === 1) return 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-300';
//   if (rank === 2) return 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-300';
//   if (rank === 3) return 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300';
//   return 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-300';
// };

// const getRewardIcon = (rank: number): string => {
//   if (rank === 1) return '🥇';
//   if (rank === 2) return '🥈';
//   if (rank === 3) return '🥉';
//   return `#${rank}`;
// };

// const getGridCols = (rewardsLength: number, isContestNotStarted: boolean): string => {
//   if (isContestNotStarted) {
//     if (rewardsLength <= 2) return 'grid-cols-1';
//     if (rewardsLength <= 4) return 'grid-cols-2';
//     if (rewardsLength <= 6) return 'grid-cols-3';
//     return 'grid-cols-4';
//   } else {
//     if (rewardsLength <= 3) return 'grid-cols-3';
//     if (rewardsLength <= 4) return 'grid-cols-4';
//     if (rewardsLength <= 5) return 'grid-cols-5';
//     return 'grid-cols-6';
//   }
// };


// const ContestInfoPage: React.FC<ContestInfoProps> = ({
//   contest,
//   leaderboard,
//   onRegister,
//   onEnterContest,
//   isLoading = false
// }) => {
//   const countdownTarget =
//     contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN
//       ? contest.startTime
//       : contest.state === ContestState.ACTIVE
//       ? contest.endTime
//       : contest.endTime;

//   const countdown = useCountdown(countdownTarget);

//   const isContestNotStarted = contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN;
//   const isContestEnded = contest.state === ContestState.ENDED || contest.state === ContestState.RESULTS_PUBLISHED;

//   // No button when contest ended
//   const renderActionButton = () => {
//     if (isContestEnded) {
//       return null;
//     }
//     if (isLoading) {
//       return (
//         <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold">
//           Loading...
//         </button>
//       );
//     }
//     switch (contest.state) {
//       case ContestState.REGISTRATION_OPEN:
//         return contest.isUserRegistered ? (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex items-center gap-2 text-green-800">
//               <CheckCircle className="w-5 h-5" />
//               <span className="font-semibold">You are registered!</span>
//             </div>
//             <p className="text-sm text-green-600 mt-1">
//               Contest starts {formatDate(contest.startTime)}
//             </p>
//           </div>
//         ) : (
//           <button
//             onClick={onRegister}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
//           >
//             Register for Contest
//           </button>
//         );
//       case ContestState.ACTIVE:
//         return contest.isUserRegistered ? (
//           <button
//             onClick={onEnterContest}
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
//           >
//             Enter Contest
//           </button>
//         ) : (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center gap-2 text-red-800">
//               <AlertCircle className="w-5 h-5" />
//               <span className="font-semibold">Registration Closed</span>
//             </div>
//             <p className="text-sm text-red-600 mt-1">
//               Contest is currently active
//             </p>
//           </div>
//         );
//       default:
//         return (
//           <button
//             disabled
//             className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
//           >
//             Registration Opens Soon
//           </button>
//         );
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//       {/* Hero Section */}
//       <div className="relative">
//         <img
//           src={contest.thumbnail}
//           alt={contest.title}
//           className="w-full h-64 object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
//           <div className="p-6 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
//                 Contest #{contest.contestNumber}
//               </span>
//               <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getStateColor(contest.state)}`}>
//                 {getStateIcon(contest.state)}
//                 {contest.state.replace('_', ' ').toUpperCase()}
//               </span>
//             </div>
//             <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
//           </div>
//         </div>
//       </div>

//       {/* Contest Details Section */}
//       <div className="p-6 border-b bg-gray-50">
//         {(contest.state === ContestState.UPCOMING ||
//           contest.state === ContestState.REGISTRATION_OPEN ||
//           contest.state === ContestState.ACTIVE) && (
//           <div className="mb-6">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold mb-3">
//                 {contest.state === ContestState.ACTIVE ? 'Contest Ends In' : 'Contest Starts In'}
//               </h3>
//               <div className="flex justify-center gap-4">
//                 {Object.entries(countdown).map(([unit, value]) => (
//                   <div key={unit} className="text-center">
//                     <div className="bg-white rounded-lg p-3 shadow-sm min-w-[60px]">
//                       <div className="text-2xl font-bold text-gray-800">{value}</div>
//                       <div className="text-xs text-gray-500 uppercase">{unit}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Contest Details Grid */}
//         <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mb-6">
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Calendar className="w-5 h-5 text-blue-600" />
//             <div>
//               <div className="font-semibold">Start Time</div>
//               <div className="text-sm text-gray-600">{formatDate(contest.startTime)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Clock className="w-5 h-5 text-red-600" />
//             <div>
//               <div className="font-semibold">End Time</div>
//               <div className="text-sm text-gray-600">{formatDate(contest.endTime)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <AlertCircle className="w-5 h-5 text-orange-600" />
//             <div>
//               <div className="font-semibold">Registration Deadline</div>
//               <div className="text-sm text-gray-600">{formatDate(contest.registrationDeadline)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Clock className="w-5 h-5 text-green-600" />
//             <div>
//               <div className="font-semibold">Problem Time Limit</div>
//               <div className="text-sm text-gray-600">{formatTime(contest.problemTimeLimit)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Users className="w-5 h-5 text-purple-600" />
//             <div>
//               <div className="font-semibold">Max Attempts</div>
//               <div className="text-sm text-gray-600">{contest.maxAttempts}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             <div>
//               <div className="font-semibold">Wrong Submission Penalty</div>
//               <div className="text-sm text-gray-600">{contest.wrongSubmissionPenalty} points</div>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="bg-white rounded-lg p-4 shadow-sm">
//           <h3 className="text-lg font-semibold mb-3">Description</h3>
//           <p className="text-gray-700 leading-relaxed">{contest.description}</p>
//         </div>

//         {/* Action Button - Only shown when contest is not ended */}
//         {renderActionButton() && (
//           <div className="mt-6">
//             {renderActionButton()}
//           </div>
//         )}
//       </div>

//       {/* Coins & Leaderboard Section */}
//       <div className="p-6">
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Side - Coin Rewards */}
//           <div>
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <Trophy className="w-6 h-6 text-yellow-500" />
//               Coin Rewards & Positions
//             </h3>
//             <div className={`grid ${getGridCols(contest.coinRewards.length, isContestNotStarted)} gap-3`}>
//               {contest.coinRewards.map((reward) => (
//                 <div
//                   key={reward.rank}
//                   className={`${isContestNotStarted ? 'p-6' : 'p-4'} rounded-lg border-2 text-center ${getRewardCardColor(reward.rank)}`}
//                 >
//                   <div className={`${isContestNotStarted ? 'text-5xl' : 'text-3xl'} mb-2`}>
//                     {getRewardIcon(reward.rank)}
//                   </div>
//                   <div className={`${isContestNotStarted ? 'text-lg' : 'text-sm'} text-gray-600 mb-1`}>
//                     Rank {reward.rank}
//                   </div>
//                   <div className={`${isContestNotStarted ? 'text-xl' : 'text-lg'} font-bold text-blue-600 flex items-center justify-center gap-1`}>
//                     <Star className={`${isContestNotStarted ? 'w-5 h-5' : 'w-4 h-4'} fill-current`} />
//                     {reward.coins}
//                   </div>
//                   <div className={`${isContestNotStarted ? 'text-sm' : 'text-xs'} text-gray-500 mt-1`}>
//                     coins
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Side - Leaderboard */}
//           <div>
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <Trophy className="w-6 h-6 text-purple-500" />
//               Leaderboard
//             </h3>
//             {isContestNotStarted ? (
//               <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
//                 <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h4 className="text-lg font-semibold text-gray-400 mb-2">Contest Not Started</h4>
//                 <p className="text-gray-400">
//                   Leaderboard will be available once the contest begins
//                 </p>
//               </div>
//             ) : leaderboard && leaderboard.rankings.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Quick stats */}
//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-blue-700">
//                       <strong>{leaderboard.getTotalParticipants()}</strong> participants
//                     </span>
//                     <span className="text-blue-600">
//                       Last updated: {formatDate(leaderboard.lastUpdated)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* All participants */}
//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {leaderboard.rankings.map((entry, index) => (
//                     <div
//                       key={entry.userId}
//                       className={`flex items-center justify-between p-3 rounded-lg border ${
//                         index < 3
//                           ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
//                           : 'bg-gray-50 border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="text-lg font-bold">
//                           {getRewardIcon(entry.rank)}
//                         </div>
//                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                           {entry.profileImage ? (
//                             <img
//                               src={entry.profileImage}
//                               alt={entry.username}
//                               className="w-full h-full rounded-full object-cover"
//                             />
//                           ) : (
//                             <Users className="w-4 h-4 text-gray-400" />
//                           )}
//                         </div>
//                         <div>
//                           <div className="font-medium">{entry.username}</div>
//                           <div className="text-xs text-gray-500">
//                             {entry.totalScore} pts • {formatTime(entry.timeTaken)}
//                           </div>
//                         </div>
//                       </div>
//                       {entry.coinsEarned && (
//                         <div className="text-right">
//                           <div className="flex items-center gap-1 text-blue-600 font-semibold">
//                             <Star className="w-3 h-3 fill-current" />
//                             {entry.coinsEarned}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gray-50 rounded-lg p-8 text-center">
//                 <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-400">No participants yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Rules & Regulations Section */}
//       <div className="p-6 bg-gray-50 border-t">
//         <h3 className="text-xl font-bold mb-6">Contest Rules & Regulations</h3>
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 General Rules
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Participants must register before the registration deadline</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Each problem has a time limit of {formatTime(contest.problemTimeLimit)}</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Maximum {contest.maxAttempts} attempts allowed per problem</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Wrong submissions incur a penalty of {contest.wrongSubmissionPenalty} points</span>
//                 </li>
//               </ul>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
//                 <Trophy className="w-5 h-5" />
//                 Scoring System
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Points are awarded based on problem difficulty and completion time</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Faster correct submissions receive higher scores</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Partial credit may be given for partially correct solutions</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Wrong submissions result in point deductions</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
//                 <AlertCircle className="w-5 h-5" />
//                 Prohibited Actions
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Collaborating with other participants during the contest</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Sharing solutions or hints with other participants</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Using external help or AI assistance</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Creating multiple accounts to participate</span>
//                 </li>
//               </ul>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
//                 <Users className="w-5 h-5" />
//                 Ranking Criteria
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Total score (higher is better)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Number of problems solved (more is better)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Total time taken (less is better)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Number of wrong submissions (fewer is better)</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             Important Notice
//           </h4>
//           <div className="text-sm text-yellow-700 grid md:grid-cols-2 gap-4">
//             <div>
//               <p>• Contest decisions are final and binding</p>
//               <p>• Technical issues should be reported immediately</p>
//             </div>
//             <div>
//               <p>• Fair play is expected from all participants</p>
//               <p>• Violations may result in disqualification</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContestInfoPage;










// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Clock, Users, Trophy, Star, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
// import axios from 'axios';
// import httpClient from '../../services/axios/httpClient';
// import { getContest, getLeaderBoard } from '../../../mock';

// // Enums and types (keeping the same)
export enum ContestState {
  UPCOMING = 'upcoming',
  REGISTRATION_OPEN = 'registration_open',
  ACTIVE = 'active',
  ENDED = 'ended',
  RESULTS_PUBLISHED = 'results_published'
}



export enum ParticipantStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISQUALIFIED = 'disqualified'
}

export class ContestReward {
  public rank: number;
  public coins: number;

  constructor({
    rank,
    coins
  }: {
    rank: number;
    coins: number;
  }) {
    this.rank = rank;
    this.coins = coins;
  }
}

// export class LeaderboardEntry {
//   public rank: number;
//   public userId: string;
//   public username: string;
//   public profileImage?: string;
//   public totalScore: number;
//   public timeTaken: number;
//   public attempts: number;
//   public status: ParticipantStatus;
//   public coinsEarned?: number;

//   constructor({
//     rank,
//     userId,
//     username,
//     profileImage,
//     totalScore,
//     timeTaken,
//     attempts,
//     status,
//     coinsEarned
//   }: {
//     rank: number;
//     userId: string;
//     username: string;
//     profileImage?: string;
//     totalScore: number;
//     timeTaken: number;
//     attempts: number;
//     status: ParticipantStatus;
//     coinsEarned?: number;
//   }) {
//     this.rank = rank;
//     this.userId = userId;
//     this.username = username;
//     this.profileImage = profileImage;
//     this.totalScore = totalScore;
//     this.timeTaken = timeTaken;
//     this.attempts = attempts;
//     this.status = status;
//     this.coinsEarned = coinsEarned;
//   }
// }

export class ContestLeaderboard {
  public contestId: string;
  public rankings: LeaderboardEntry[];
  public lastUpdated: Date;

  constructor({
    contestId,
    rankings,
    lastUpdated = new Date()
  }: {
    contestId: string;
    rankings: LeaderboardEntry[];
    lastUpdated?: Date;
  }) {
    this.contestId = contestId;
    this.rankings = rankings;
    this.lastUpdated = lastUpdated;
  }

  updateRankings(newRankings: LeaderboardEntry[]): void {
    this.rankings = newRankings;
    this.lastUpdated = new Date();
  }

  getTotalParticipants(): number {
    return this.rankings.length;
  }

  getTopN(n: number): LeaderboardEntry[] {
    return this.rankings.slice(0, n);
  }
}

// Contest data interface
interface ContestData {
  id: string;
  contestNumber: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  thumbnail: string;
  registrationDeadline: Date;
  problemTimeLimit: number;
  maxAttempts: number;
  wrongSubmissionPenalty: number;
  coinRewards: ContestReward[];
  state: ContestState;
  isUserRegistered: boolean;
}

// API Response interfaces
interface ContestResponse {
  contest: ContestData;
}

interface LeaderboardResponse {
  leaderboard: ContestLeaderboard;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
}

// URL params interface
interface ContestParams {
  contestNumber: string | number;
}

// // Countdown timer hook (keeping the same)
// const useCountdown = (targetDate: Date) => {
//   const [timeLeft, setTimeLeft] = useState<{
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
//   }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const target = targetDate.getTime();
//       const difference = target - now;

//       if (difference > 0) {
//         setTimeLeft({
//           days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//           hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//           minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
//           seconds: Math.floor((difference % (1000 * 60)) / 1000)
//         });
//       } else {
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetDate]);

//   return timeLeft;
// };

// // Helper functions (keeping the same)
const getStateColor = (state: ContestState): string => {
  switch (state) {
    case ContestState.UPCOMING:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case ContestState.REGISTRATION_OPEN:
      return 'bg-green-100 text-green-800 border-green-200';
    case ContestState.ACTIVE:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case ContestState.ENDED:
      return 'bg-red-100 text-red-800 border-red-200';
    case ContestState.RESULTS_PUBLISHED:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStateIcon = (state: ContestState) => {
  switch (state) {
    case ContestState.REGISTRATION_OPEN:
      return <CheckCircle className="w-4 h-4" />;
    case ContestState.ACTIVE:
      return <Clock className="w-4 h-4" />;
    case ContestState.ENDED:
    case ContestState.RESULTS_PUBLISHED:
      return <Trophy className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const getContestThumbnail = (thumbnailKey?: string) => {
  if (thumbnailKey) {
    return imageKitService.getProfileImageUrl(thumbnailKey, 400, 200, { radius: "8" });
  }
  return '/default-contest-thumbnail.jpg'; // fallback image
};


const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const getRewardCardColor = (rank: number): string => {
  if (rank === 1) return 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-300';
  if (rank === 2) return 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-300';
  if (rank === 3) return 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-300';
  return 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-300';
};

const getRewardIcon = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getGridCols = (rewardsLength: number, isContestNotStarted: boolean): string => {
  if (isContestNotStarted) {
    if (rewardsLength <= 2) return 'grid-cols-1';
    if (rewardsLength <= 4) return 'grid-cols-2';
    if (rewardsLength <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  } else {
    if (rewardsLength <= 3) return 'grid-cols-3';
    if (rewardsLength <= 4) return 'grid-cols-4';
    if (rewardsLength <= 5) return 'grid-cols-5';
    return 'grid-cols-6';
  }
};

// const ContestInfoPage: React.FC = () => {
//   // Get contestId from URL parameters
//   const { contestId } = useParams<ContestParams>();

//   // State management
//   const [contest, setContest] = useState<ContestData | null>(null);
//   const [leaderboard, setLeaderboard] = useState<ContestLeaderboard | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isRegistering, setIsRegistering] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate()
//   // Fetch contest data
//   const fetchContestData = async () => {
//     if (!contestId) return;

//     try {
//       setIsLoading(true);
//       setError(null);

//       // const response = await httpClient.get(`/user/contests/${contestId}`);

//       const response = getContest()



//       // Convert date strings to Date objects
//       const contestData = {
//         ...response.data.contest,
//         startTime: new Date(response.data.contest.startTime),
//         endTime: new Date(response.data.contest.endTime),
//         registrationDeadline: new Date(response.data.contest.registrationDeadline)
//       };

//       setContest(contestData);
//     } catch (err) {
//       console.error('Error fetching contest:', err);
//       setError('Failed to load contest data');
//     }
//   };

//   // Fetch leaderboard data
//   const fetchLeaderboardData = async () => {
//     if (!contestId) return;

//     try {
//       // const response = await httpClient.get(`/contests/${contestId}/leaderboard`);

//       const response = getLeaderBoard()
//       console.log(response.data.leaderboard.rankings);

//       // Convert date strings to Date objects and create LeaderboardEntry instances
//       const leaderboardData = new ContestLeaderboard({
//         contestId: response.data.leaderboard.contestId,
//         rankings: response.data.leaderboard.rankings.map(entry => new LeaderboardEntry(entry)),
//         lastUpdated: new Date(response.data.leaderboard.lastUpdated)
//       });

//       setLeaderboard(leaderboardData);
//     } catch (err) {
//       console.error('Error fetching leaderboard:', err);
//       // Don't set error for leaderboard as it might not exist for upcoming contests
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle contest registration
//   const handleRegister = async () => {
//     if (!contestId || !contest) return;

//     try {
//       setIsRegistering(true);
//       setError(null);

//       // const response = await axios.post<RegistrationResponse>(
//       //   `${API_BASE_URL}/contests/${contestId}/register`,
//       //   {},
//       //   {
//       //     headers: {
//       //       'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust token retrieval as needed
//       //     }
//       //   }
//       // );

//       const response = await httpClient.post(`/user/contests/${contestId}/register`)

//       if (response.data.success) {
//         // Update contest state to reflect registration
//         setContest(prev => prev ? { ...prev, isUserRegistered: true } : null);
//         // You might want to show a success toast here
//         console.log('Registration successful:', response.data.message);
//       }
//     } catch (err) {
//       console.error('Error registering for contest:', err);
//       setError('Failed to register for contest');
//     } finally {
//       setIsRegistering(false);
//     }
//   };

//   // Handle entering contest
//   const handleEnterContest = () => {
//     if (!contestId) return;

//     // Navigate to contest page - adjust the route as needed
//     // window.location.href = `/contests/${contestId}/participate`;
//     // Or if you're using React Router:
//      navigate(`/contests/${contestId}/participate`);
//   };

//   // Fetch data on component mount and when contestId changes
//   useEffect(() => {
//     if (contestId) {
//       fetchContestData();
//     }
//   }, [contestId]);

//   // Fetch leaderboard after contest data is loaded
//   useEffect(() => {
//     if (contest) {
//       fetchLeaderboardData();
//     }
//   }, [contest]);

//   // Refresh leaderboard periodically for active contests
//   useEffect(() => {
//     if (contest?.state === ContestState.ACTIVE) {
//       const interval = setInterval(fetchLeaderboardData, 30000); // Refresh every 30 seconds
//       return () => clearInterval(interval);
//     }
//   }, [contest?.state]);

//   // Error state
//   if (error && !contest) {
//     return (
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
//         <div className="text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Contest</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Loading state
//   if (isLoading || !contest) {
//     return (
//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
//         <div className="animate-pulse">
//           <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
//           <div className="space-y-4">
//             <div className="h-8 bg-gray-200 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             <div className="grid grid-cols-3 gap-4">
//               <div className="h-20 bg-gray-200 rounded"></div>
//               <div className="h-20 bg-gray-200 rounded"></div>
//               <div className="h-20 bg-gray-200 rounded"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Rest of the component logic (keeping the same as your original)
//   const countdownTarget =
//     contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN
//       ? contest.startTime
//       : contest.state === ContestState.ACTIVE
//       ? contest.endTime
//       : contest.endTime;

//   const countdown = useCountdown(countdownTarget);

//   const isContestNotStarted = contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN;
//   const isContestEnded = contest.state === ContestState.ENDED || contest.state === ContestState.RESULTS_PUBLISHED;

//   // No button when contest ended
//   const renderActionButton = () => {
//     if (isContestEnded) {
//       return null;
//     }
//     if (isRegistering) {
//       return (
//         <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold">
//           Registering...
//         </button>
//       );
//     }
//     switch (contest.state) {
//       case ContestState.REGISTRATION_OPEN:
//         return contest.isUserRegistered ? (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex items-center gap-2 text-green-800">
//               <CheckCircle className="w-5 h-5" />
//               <span className="font-semibold">You are registered!</span>
//             </div>
//             <p className="text-sm text-green-600 mt-1">
//               Contest starts {formatDate(contest.startTime)}
//             </p>
//           </div>
//         ) : (
//           <button
//             onClick={handleRegister}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
//           >
//             Register for Contest
//           </button>
//         );
//       case ContestState.ACTIVE:
//         return contest.isUserRegistered ? (
//           <button
//             onClick={handleEnterContest}
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
//           >
//             Enter Contest
//           </button>
//         ) : (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center gap-2 text-red-800">
//               <AlertCircle className="w-5 h-5" />
//               <span className="font-semibold">Registration Closed</span>
//             </div>
//             <p className="text-sm text-red-600 mt-1">
//               Contest is currently active
//             </p>
//           </div>
//         );
//       default:
//         return (
//           <button
//             disabled
//             className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
//           >
//             Registration Opens Soon
//           </button>
//         );
//     }
//   };

//   // The rest of your JSX remains exactly the same...
//   return (
//     <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//       {/* All your existing JSX code remains the same from here */}
//       {/* Hero Section */}
//       <div className="relative">
//         <img
//           src={contest.thumbnail}
//           alt={contest.title}
//           className="w-full h-64 object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
//           <div className="p-6 text-white">
//             <div className="flex items-center gap-3 mb-2">
//               <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
//                 Contest #{contest.contestNumber}
//               </span>
//               <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getStateColor(contest.state)}`}>
//                 {getStateIcon(contest.state)}
//                 {contest.state.replace('_', ' ').toUpperCase()}
//               </span>
//             </div>
//             <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
//           </div>
//         </div>
//       </div>

//       {/* Contest Details Section */}
//       <div className="p-6 border-b bg-gray-50">
//         {(contest.state === ContestState.UPCOMING ||
//           contest.state === ContestState.REGISTRATION_OPEN ||
//           contest.state === ContestState.ACTIVE) && (
//           <div className="mb-6">
//             <div className="text-center">
//               <h3 className="text-lg font-semibold mb-3">
//                 {contest.state === ContestState.ACTIVE ? 'Contest Ends In' : 'Contest Starts In'}
//               </h3>
//               <div className="flex justify-center gap-4">
//                 {Object.entries(countdown).map(([unit, value]) => (
//                   <div key={unit} className="text-center">
//                     <div className="bg-white rounded-lg p-3 shadow-sm min-w-[60px]">
//                       <div className="text-2xl font-bold text-gray-800">{value}</div>
//                       <div className="text-xs text-gray-500 uppercase">{unit}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Contest Details Grid */}
//         <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mb-6">
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Calendar className="w-5 h-5 text-blue-600" />
//             <div>
//               <div className="font-semibold">Start Time</div>
//               <div className="text-sm text-gray-600">{formatDate(contest.startTime)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Clock className="w-5 h-5 text-red-600" />
//             <div>
//               <div className="font-semibold">End Time</div>
//               <div className="text-sm text-gray-600">{formatDate(contest.endTime)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <AlertCircle className="w-5 h-5 text-orange-600" />
//             <div>
//               <div className="font-semibold">Registration Deadline</div>
//               <div className="text-sm text-gray-600">{formatDate(contest.registrationDeadline)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Clock className="w-5 h-5 text-green-600" />
//             <div>
//               <div className="font-semibold">Problem Time Limit</div>
//               <div className="text-sm text-gray-600">{formatTime(contest.problemTimeLimit)}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <Users className="w-5 h-5 text-purple-600" />
//             <div>
//               <div className="font-semibold">Max Attempts</div>
//               <div className="text-sm text-gray-600">{contest.maxAttempts}</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             <div>
//               <div className="font-semibold">Wrong Submission Penalty</div>
//               <div className="text-sm text-gray-600">{contest.wrongSubmissionPenalty} points</div>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="bg-white rounded-lg p-4 shadow-sm">
//           <h3 className="text-lg font-semibold mb-3">Description</h3>
//           <p className="text-gray-700 leading-relaxed">{contest.description}</p>
//         </div>

//         {/* Action Button - Only shown when contest is not ended */}
//         {renderActionButton() && (
//           <div className="mt-6">
//             {renderActionButton()}
//           </div>
//         )}
//       </div>

//       {/* Coins & Leaderboard Section */}
//       <div className="p-6">
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Side - Coin Rewards */}
//           <div>
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <Trophy className="w-6 h-6 text-yellow-500" />
//               Coin Rewards & Positions
//             </h3>
//             <div className={`grid ${getGridCols(contest.coinRewards.length, isContestNotStarted)} gap-3`}>
//               {contest.coinRewards.map((reward) => (
//                 <div
//                   key={reward.rank}
//                   className={`${isContestNotStarted ? 'p-6' : 'p-4'} rounded-lg border-2 text-center ${getRewardCardColor(reward.rank)}`}
//                 >
//                   <div className={`${isContestNotStarted ? 'text-5xl' : 'text-3xl'} mb-2`}>
//                     {getRewardIcon(reward.rank)}
//                   </div>
//                   <div className={`${isContestNotStarted ? 'text-lg' : 'text-sm'} text-gray-600 mb-1`}>
//                     Rank {reward.rank}
//                   </div>
//                   <div className={`${isContestNotStarted ? 'text-xl' : 'text-lg'} font-bold text-blue-600 flex items-center justify-center gap-1`}>
//                     <Star className={`${isContestNotStarted ? 'w-5 h-5' : 'w-4 h-4'} fill-current`} />
//                     {reward.coins}
//                   </div>
//                   <div className={`${isContestNotStarted ? 'text-sm' : 'text-xs'} text-gray-500 mt-1`}>
//                     coins
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Side - Leaderboard */}
//           <div>
//             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//               <Trophy className="w-6 h-6 text-purple-500" />
//               Leaderboard
//             </h3>
//             {isContestNotStarted ? (
//               <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
//                 <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h4 className="text-lg font-semibold text-gray-400 mb-2">Contest Not Started</h4>
//                 <p className="text-gray-400">
//                   Leaderboard will be available once the contest begins
//                 </p>
//               </div>
//             ) : leaderboard && leaderboard.rankings.length > 0 ? (
//               <div className="space-y-4">
//                 {/* Quick stats */}
//                 <div className="bg-blue-50 rounded-lg p-4">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-blue-700">
//                       <strong>{leaderboard.getTotalParticipants()}</strong> participants
//                     </span>
//                     <span className="text-blue-600">
//                       Last updated: {formatDate(leaderboard.lastUpdated)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* All participants */}
//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {leaderboard.rankings.map((entry, index) => (
//                     <div
//                       key={entry.userId}
//                       className={`flex items-center justify-between p-3 rounded-lg border ${
//                         index < 3
//                           ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
//                           : 'bg-gray-50 border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="text-lg font-bold">
//                           {getRewardIcon(entry.rank)}
//                         </div>
//                         <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//                           {entry.profileImage ? (
//                             <img
//                               src={entry.profileImage}
//                               alt={entry.username}
//                               className="w-full h-full rounded-full object-cover"
//                             />
//                           ) : (
//                             <Users className="w-4 h-4 text-gray-400" />
//                           )}
//                         </div>
//                         <div>
//                           <div className="font-medium">{entry.username}</div>
//                           <div className="text-xs text-gray-500">
//                             {entry.totalScore} pts • {formatTime(entry.timeTaken)}
//                           </div>
//                         </div>
//                       </div>
//                       {entry.coinsEarned && (
//                         <div className="text-right">
//                           <div className="flex items-center gap-1 text-blue-600 font-semibold">
//                             <Star className="w-3 h-3 fill-current" />
//                             {entry.coinsEarned}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gray-50 rounded-lg p-8 text-center">
//                 <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-400">No participants yet</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Rules & Regulations Section - keeping the same */}
//       <div className="p-6 bg-gray-50 border-t">
//         <h3 className="text-xl font-bold mb-6">Contest Rules & Regulations</h3>
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 General Rules
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Participants must register before the registration deadline</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Each problem has a time limit of {formatTime(contest.problemTimeLimit)}</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Maximum {contest.maxAttempts} attempts allowed per problem</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-blue-600 mt-1">•</span>
//                   <span>Wrong submissions incur a penalty of {contest.wrongSubmissionPenalty} points</span>
//                 </li>
//               </ul>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
//                 <Trophy className="w-5 h-5" />
//                 Scoring System
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Points are awarded based on problem difficulty and completion time</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Faster correct submissions receive higher scores</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Partial credit may be given for partially correct solutions</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-green-600 mt-1">•</span>
//                   <span>Wrong submissions result in point deductions</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
//                 <AlertCircle className="w-5 h-5" />
//                 Prohibited Actions
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Collaborating with other participants during the contest</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Sharing solutions or hints with other participants</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Using external help or AI assistance</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-red-600 mt-1">•</span>
//                   <span>Creating multiple accounts to participate</span>
//                 </li>
//               </ul>
//             </div>
//             <div className="bg-white rounded-lg p-4 shadow-sm">
//               <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
//                 <Users className="w-5 h-5" />
//                 Ranking Criteria
//               </h4>
//               <ul className="text-sm text-gray-700 space-y-2">
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Total score (higher is better)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Number of problems solved (more is better)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Total time taken (less is better)</span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="text-purple-600 mt-1">•</span>
//                   <span>Number of wrong submissions (fewer is better)</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
//             <AlertCircle className="w-5 h-5" />
//             Important Notice
//           </h4>
//           <div className="text-sm text-yellow-700 grid md:grid-cols-2 gap-4">
//             <div>
//               <p>• Contest decisions are final and binding</p>
//               <p>• Technical issues should be reported immediately</p>
//             </div>
//             <div>
//               <p>• Fair play is expected from all participants</p>
//               <p>• Violations may result in disqualification</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContestInfoPage;





















import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Users, Trophy, Star, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import httpClient from '../../services/axios/httpClient';
import { getContest, getLeaderBoard } from '../../../mock';
import Navbar from '../../components/user/Navbar';
import { imageKitService } from '../../services/ImageKitService';

// ... (keep all your enums, classes, and interfaces the same)

// Countdown timer hook (keeping the same)
const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// ... (keep all your helper functions the same)

const ContestInfoPage: React.FC = () => {
  // Get contestId from URL parameters
  const { contestNumber } = useParams<ContestParams>();

  // State management
  const [contest, setContest] = useState<ContestData | null>(null);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Calculate countdown target (before any early returns)
  const countdownTarget = contest
    ? (contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN
      ? contest.startTime
      : contest.state === ContestState.ACTIVE
        ? contest.endTime
        : contest.endTime)
    : null;

  // ALWAYS call useCountdown - this fixes the hook order issue
  const countdown = useCountdown(countdownTarget);

  // ... (keep all your functions the same: fetchContestData, fetchLeaderboardData, handleRegister, handleEnterContest)

  const fetchContestData = async () => {
    if (!contestNumber) return;

    try {
      setIsLoading(true);
      setError(null);

      // const response = getContest();

      const response = await httpClient.get(`/user/contests/${contestNumber}`)

      console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", response.data);


      // Convert date strings to Date objects
      const contestData = {
        ...response.data.contest,
        startTime: new Date(response.data.contest.startTime),
        endTime: new Date(response.data.contest.endTime),
        registrationDeadline: new Date(response.data.contest.registrationDeadline)
      };
      console.log("logggggggggggggggggggg", contestData);

      setContest(contestData);
    } catch (err) {
      console.error('Error fetching contest:', err);
      setError('Failed to load contest data');
    }
  };

  const fetchLeaderboardData = async () => {
    if (!contestNumber) return;

    try {
      const response = getLeaderBoard();
      console.log(response.data.leaderboard.rankings);

      const leaderboardData = new ContestLeaderboard({
        contestId: response.data.leaderboard.contestId,
        rankings: response.data.leaderboard.rankings.map(entry => new LeaderboardEntry(entry)),
        lastUpdated: new Date(response.data.leaderboard.lastUpdated)
      });

      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!contestNumber || !contest) return;

    try {
      setIsRegistering(true);
      setError(null);

      const response = await httpClient.post(`/user/contests/register`, { contestId: contest.id });

      if (response.data.success) {
        setContest(prev => prev ? { ...prev, isUserRegistered: true } : null);
        console.log('Registration successful:', response.data.message);
      }
    } catch (err) {
      console.error('Error registering for contest:', err);
      setError('Failed to register for contest');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleEnterContest = () => {
    if (!contestNumber) return;
    navigate(`/contest/${contestNumber}/participate`);
  };

  // Fetch data on component mount and when contestId changes
  useEffect(() => {
    if (contestNumber) {
      fetchContestData();
    }
  }, [contestNumber]);

  // Fetch leaderboard after contest data is loaded
  useEffect(() => {
    if (contest) {
      fetchLeaderboardData();
    }
  }, [contest]);

  // Refresh leaderboard periodically for active contests
  useEffect(() => {
    if (contest?.state === ContestState.ACTIVE) {
      const interval = setInterval(fetchLeaderboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [contest?.state]);

  // Error state
  if (error && !contest) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Contest</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !contest) {
    return (
      <>
        <Navbar />
        <div className='bg-black w-full h-screen'></div>
      </>
      // <div className=" mx-auto bg-black rounded-xl shadow-lg overflow-hidden p-6">
      //   <div className="animate-pulse">
      //     <div className="h-64 bg-gray-950 rounded-lg mb-6"></div>
      //     <div className="space-y-4">
      //       <div className="h-8 bg-gray-900 rounded w-3/4"></div>
      //       <div className="h-4 bg-gray-900 rounded w-1/2"></div>
      //       <div className="grid grid-cols-3 gap-4">
      //         <div className="h-20 bg-gray-900 rounded"></div>
      //         <div className="h-20 bg-gray-900 rounded"></div>
      //         <div className="h-20 bg-gray-900 rounded"></div>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }

  // Now we can safely use contest data (we know contest exists)
  const isContestNotStarted = contest.state === ContestState.UPCOMING || contest.state === ContestState.REGISTRATION_OPEN;
  const isContestEnded = contest.state === ContestState.ENDED || contest.state === ContestState.RESULTS_PUBLISHED;

  const renderActionButton = () => {
    if (isContestEnded) {
      return null;
    }
    if (isRegistering) {
      return (
        <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold">
          Registering...
        </button>
      );
    }
    switch (contest.state) {
      case ContestState.REGISTRATION_OPEN:
        return contest.isUserRegistered ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">You are registered!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Contest starts {formatDate(contest.startTime)}
            </p>
          </div>
        ) : (
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Register for Contest
          </button>
        );
      case ContestState.ACTIVE:
        return contest.isUserRegistered ? (
          <button
            onClick={handleEnterContest}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Enter Contest
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Registration Closed</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Contest is currently active
            </p>
          </div>
        );
      default:
        return (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
          >
            Registration Opens Soon
          </button>
        );
    }
  };

  return (
    <>
      <div className=" bg-black text-white flex flex-col">
        <Navbar />
        <div className="max-w-6xl mx-auto bg-black rounded-xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <img
            src={getContestThumbnail(contest.thumbnail)}
            alt={contest.title}
            className="w-full h-64 object-cover"
          />
          <div className="relative">
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm bg-black bg-opacity-20 px-2 py-1 rounded">
                    Contest #{contest.contestNumber}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${getStateColor(contest.state)}`}>
                    {getStateIcon(contest.state)}
                    {contest.state.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
              </div>
            </div>
          </div>

          {/* Contest Details Section */}
          <div className="p-6 border-b bg-black-50">
            {(contest.state === ContestState.UPCOMING ||
              contest.state === ContestState.REGISTRATION_OPEN ||
              contest.state === ContestState.ACTIVE) && (
                <div className="mb-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-3">
                      {contest.state === ContestState.ACTIVE ? 'Contest Ends In' : 'Contest Starts In'}
                    </h3>
                    <div className="flex justify-center gap-4">
                      {Object.entries(countdown).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className="bg-white rounded-lg p-3 shadow-sm min-w-[60px]">
                            <div className="text-2xl font-bold text-gray-800">{value}</div>
                            <div className="text-xs text-gray-500 uppercase">{unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            {/* Contest Details Grid */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold">Start Time</div>
                  <div className="text-sm text-gray-600">{formatDate(contest.startTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-semibold">End Time</div>
                  <div className="text-sm text-gray-600">{formatDate(contest.endTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-semibold">Registration Deadline</div>
                  <div className="text-sm text-gray-600">{formatDate(contest.registrationDeadline)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold">Problem Time Limit</div>
                  <div className="text-sm text-gray-600">{formatTime(contest.problemTimeLimit)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-semibold">Max Attempts</div>
                  <div className="text-sm text-gray-600">{contest.maxAttempts}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-950 rounded-lg shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-semibold">Wrong Submission Penalty</div>
                  <div className="text-sm text-gray-600">{contest.wrongSubmissionPenalty} points</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{contest.description}</p>
            </div>

            {/* Action Button */}
            {renderActionButton() && (
              <div className="mt-6">
                {renderActionButton()}
              </div>
            )}
          </div>

          {/* Rest of your JSX remains the same... */}
          {/* Just keeping the coin rewards and leaderboard sections as they were */}
          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Side - Coin Rewards */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Coin Rewards & Positions
                </h3>
                <div className={`grid ${getGridCols(contest.coinRewards.length, isContestNotStarted)} gap-3`}>
                  {contest.coinRewards.map((reward) => (
                    <div
                      key={reward.rank}
                      className={`${isContestNotStarted ? 'p-6' : 'p-4'} rounded-lg border-2 text-center ${getRewardCardColor(reward.rank)}`}
                    >
                      <div className={`${isContestNotStarted ? 'text-5xl' : 'text-3xl'} mb-2`}>
                        {getRewardIcon(reward.rank)}
                      </div>
                      <div className={`${isContestNotStarted ? 'text-lg' : 'text-sm'} text-gray-600 mb-1`}>
                        Rank {reward.rank}
                      </div>
                      <div className={`${isContestNotStarted ? 'text-xl' : 'text-lg'} font-bold text-blue-600 flex items-center justify-center gap-1`}>
                        <Star className={`${isContestNotStarted ? 'w-5 h-5' : 'w-4 h-4'} fill-current`} />
                        {reward.coins}
                      </div>
                      <div className={`${isContestNotStarted ? 'text-sm' : 'text-xs'} text-gray-500 mt-1`}>
                        coins
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Leaderboard */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-purple-500" />
                  Leaderboard
                </h3>
                {isContestNotStarted ? (
                  <div className="bg-gray-950 rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-400 mb-2">Contest Not Started</h4>
                    <p className="text-gray-400">
                      Leaderboard will be available once the contest begins
                    </p>
                  </div>
                ) : leaderboard && leaderboard.rankings.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-700">
                          <strong>{leaderboard.getTotalParticipants()}</strong> participants
                        </span>
                        <span className="text-blue-600">
                          Last updated: {formatDate(leaderboard.lastUpdated)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {leaderboard.rankings.map((entry, index) => (
                        <div
                          key={entry.userId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${index < 3
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                            : 'bg-gray-950 border-gray-200'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold">
                              {getRewardIcon(entry.rank)}
                            </div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              {entry.profileImage ? (
                                <img
                                  src={entry.profileImage}
                                  alt={entry.username}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <Users className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{entry.username}</div>
                              <div className="text-xs text-gray-500">
                                {entry.totalScore} pts • {formatTime(entry.timeTaken)}
                              </div>
                            </div>
                          </div>
                          {entry.coinsEarned && (
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                <Star className="w-3 h-3 fill-current" />
                                {entry.coinsEarned}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">No participants yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rules & Regulations Section */}
          <div className="p-6 bg-black border-t">
            <h3 className="text-xl font-bold mb-6">Contest Rules & Regulations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    General Rules
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Participants must register before the registration deadline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Each problem has a time limit of {formatTime(contest.problemTimeLimit)}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Maximum {contest.maxAttempts} attempts allowed per problem</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Wrong submissions incur a penalty of {contest.wrongSubmissionPenalty} points</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Scoring System
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Points are awarded based on problem difficulty and completion time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Faster correct submissions receive higher scores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Partial credit may be given for partially correct solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Wrong submissions result in point deductions</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Prohibited Actions
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Collaborating with other participants during the contest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Sharing solutions or hints with other participants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Using external help or AI assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Creating multiple accounts to participate</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-950 rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Ranking Criteria
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Total score (higher is better)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Number of problems solved (more is better)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Total time taken (less is better)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Number of wrong submissions (fewer is better)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-950 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Notice
              </h4>
              <div className="text-sm text-yellow-700 grid md:grid-cols-2 gap-4">
                <div>
                  <p>• Contest decisions are final and binding</p>
                  <p>• Technical issues should be reported immediately</p>
                </div>
                <div>
                  <p>• Fair play is expected from all participants</p>
                  <p>• Violations may result in disqualification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContestInfoPage;
