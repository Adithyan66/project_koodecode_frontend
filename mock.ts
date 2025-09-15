export const mockActiveContest = [
{
  id: "64f2a1e5b8c9d0123456789a",
  contestNumber: 15,
  title: "Weekly Algorithm Challenge #15",
  description: "Test your skills with dynamic programming, graph algorithms, and data structures. Perfect for intermediate to advanced developers looking to enhance their problem-solving abilities.",
  thumbnailKey: "profile-images/68c57150ab58780028e1df1f/1757874510573.png",
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
  endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // Ends in 1 hour
  registrationDeadline: new Date(Date.now() - 3 * 60 * 60 * 1000), // Closed 3 hours ago
  totalParticipants: 1247,
  maxReward: 2000,
  state: "active",
  isRegistered: true,
  canRegister: false,
  timeRemaining: 3600 // 1 hour in seconds
},
{
  id: "64f2a1e5b8c9d0123456789a",
  contestNumber: 15,
  title: "Weekly Algorithm Challenge #15",
  description: "Test your skills with dynamic programming, graph algorithms, and data structures. Perfect for intermediate to advanced developers looking to enhance their problem-solving abilities.",
  thumbnailKey: "profile-images/68c57150ab58780028e1df1f/1757874510573.png",
  startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
  endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // Ends in 1 hour
  registrationDeadline: new Date(Date.now() - 3 * 60 * 60 * 1000), // Closed 3 hours ago
  totalParticipants: 1247,
  maxReward: 2000,
  state: "active",
  isRegistered: true,
  canRegister: false,
  timeRemaining: 3600 // 1 hour in seconds
}
];

export const mockUpcomingContests = [
  {
    id: "64f2a1e5b8c9d0123456789b",
    contestNumber: 16,
    title: "Data Structures Mastery Contest",
    description: "Focus on advanced data structures like tries, segment trees, and Fenwick trees. Suitable for competitive programmers and algorithm enthusiasts.",
    thumbnailKey: "profile-images/68c57150ab58780028e1df1f/1757874920228.png",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours duration
    registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000), // 30 min before start
    totalParticipants: 89,
    maxReward: 1500,
    state: "upcoming",
    isRegistered: false,
    canRegister: true,


  },
  {
    id: "64f2a1e5b8c9d0123456789c",
    contestNumber: 17,
    title: "String Algorithms Championship",
    description: "Master string manipulation, pattern matching, and text processing algorithms. Includes KMP, Rabin-Karp, and suffix array problems.",
    thumbnailKey: "profile-images/68c57150ab58780028e1df1f/1757874920228.png",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000), // 2.5 hours
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000), // 45 min before
    totalParticipants: 234,
    maxReward: 1800,
    state: "upcoming",
    isRegistered: true,
    canRegister: true
  }
  
];

export const mockPastContests = [
  {
    id: "64f2a1e5b8c9d0123456788a",
    contestNumber: 14,
    title: "Recursion & Backtracking Challenge",
    description: "Solved complex recursive problems and backtracking algorithms.",
    thumbnailKey: "profile-images/68c57150ab58780028e1df1f/1757874920228.png",
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    registrationDeadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000),
    totalParticipants: 892,
    maxReward: 1800,
    state: "ended",
    isRegistered: true,
    canRegister: false,

  },
  {
    id: "64f2a1e5b8c9d0123456788b",
    contestNumber: 13,
    title: "Array Manipulation Masters",
    description: "Advanced array algorithms and optimization techniques.",
    thumbnailKey: "profile-images/68c57150ab58780028e1df1f/1757874920228.png",
    startTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    endTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000),
    registrationDeadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000),
    totalParticipants: 1456,
    maxReward: 2200,
    state: "ended",
    isRegistered: true,
    canRegister: false
  }
];




export const mockApiResponses = {
  getActiveContest: () => ({
    success: true,
    message: "Active contest retrieved successfully",
    data: {
      data: mockActiveContest
    }
  }),

  getUpcomingContests: () => ({
    success: true,
    message: "Upcoming contests retrieved successfully",
    data: {
      data: mockUpcomingContests
    }
  }),

  getPastContests: () => ({
    success: true,
    message: "Past contests retrieved successfully",
    data: {
      data: mockPastContests
    }
  }),

  getLeaderboard: (contestId: string) => ({
    success: true,
    message: "Leaderboard retrieved successfully",
    data: {
      data: mockLeaderboard
    }
  }),


  registerForContest: (contestId: string) => ({
    success: true,
    message: "Successfully registered for contest",
    data: {
      participantId: "64f2a1e5b8c9d0123456790a",
      contestId,
      registrationTime: new Date(),
      assignedProblemTitle: "Maximum Subarray Sum"
    }
  })
};









export const mockLeaderboard = {
  contestId: "64f2a1e5b8c9d0123456789a",
  rankings: [
    {
      rank: 1,
      username: "AlgorithmMaster",
      profileImage: "users/profile1.jpg",
      totalScore: 2850,
      timeTaken: "1h 23m 45s",
      attempts: 1,
      status: "Completed",
      coinsEarned: 2000,
      isCurrentUser: false
    },
    {
      rank: 2,
      username: "CodeNinja42",
      profileImage: "users/profile2.jpg",
      totalScore: 2720,
      timeTaken: "1h 28m 12s",
      attempts: 2,
      status: "Completed",
      coinsEarned: 1200,
      isCurrentUser: false
    },
    {
      rank: 3,
      username: "DevGuru",
      profileImage: "users/profile3.jpg",
      totalScore: 2680,
      timeTaken: "1h 31m 07s",
      attempts: 1,
      status: "Completed",
      coinsEarned: 800,
      isCurrentUser: false
    },
    {
      rank: 4,
      username: "ByteWarrior",
      profileImage: "users/profile4.jpg",
      totalScore: 2545,
      timeTaken: "1h 42m 33s",
      attempts: 3,
      status: "Completed",
      coinsEarned: 400,
      isCurrentUser: false
    },
    {
      rank: 5,
      username: "LogicLord",
      profileImage: "users/profile5.jpg",
      totalScore: 2489,
      timeTaken: "1h 45m 21s",
      attempts: 2,
      status: "Completed",
      coinsEarned: 300,
      isCurrentUser: false
    },
    {
      rank: 6,
      username: "StackOverflow_Hero",
      profileImage: "users/profile6.jpg",
      totalScore: 2434,
      timeTaken: "1h 48m 56s",
      attempts: 1,
      status: "Completed",
      coinsEarned: 200,
      isCurrentUser: false
    },
    {
      rank: 7,
      username: "you_username_here", // This will be the current user
      profileImage: "users/your-profile.jpg",
      totalScore: 2398,
      timeTaken: "1h 52m 14s",
      attempts: 4,
      status: "Completed",
      coinsEarned: 150,
      isCurrentUser: true
    },
    {
      rank: 8,
      username: "RecursionKing",
      profileImage: "users/profile8.jpg",
      totalScore: 2356,
      timeTaken: "1h 55m 43s",
      attempts: 2,
      status: "Completed",
      coinsEarned: 100,
      isCurrentUser: false
    },
    {
      rank: 9,
      username: "DataStructurePro",
      profileImage: "users/profile9.jpg",
      totalScore: 2312,
      timeTaken: "1h 58m 29s",
      attempts: 3,
      status: "Completed",
      coinsEarned: 75,
      isCurrentUser: false
    },
    {
      rank: 10,
      username: "OptimizationGuru",
      profileImage: "users/profile10.jpg",
      totalScore: 2278,
      timeTaken: "2h 01m 17s",
      attempts: 1,
      status: "Completed",
      coinsEarned: 50,
      isCurrentUser: false
    },
    {
      rank: 11,
      username: "GraphExplorer",
      profileImage: "users/profile11.jpg",
      totalScore: 2245,
      timeTaken: "2h 04m 52s",
      attempts: 2,
      status: "Completed",
      coinsEarned: 25,
      isCurrentUser: false
    },
    {
      rank: 12,
      username: "DynamicProgrammer",
      profileImage: "users/profile12.jpg",
      totalScore: 2198,
      timeTaken: "2h 07m 38s",
      attempts: 4,
      status: "Completed",
      coinsEarned: 25,
      isCurrentUser: false
    },
    {
      rank: 13,
      username: "TreeTraverser",
      profileImage: "users/profile13.jpg",
      totalScore: 2156,
      timeTaken: "2h 11m 45s",
      attempts: 3,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 14,
      username: "SortingMaster",
      profileImage: "users/profile14.jpg",
      totalScore: 2134,
      timeTaken: "2h 14m 12s",
      attempts: 5,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 15,
      username: "HashTableHero",
      profileImage: "users/profile15.jpg",
      totalScore: 2089,
      timeTaken: "2h 17m 56s",
      attempts: 2,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 16,
      username: "LinkedListLegend",
      profileImage: "users/profile16.jpg",
      totalScore: 2045,
      timeTaken: "2h 21m 33s",
      attempts: 3,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 17,
      username: "BinarySearchBoss",
      profileImage: "users/profile17.jpg",
      totalScore: 1998,
      timeTaken: "2h 25m 07s",
      attempts: 1,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 18,
      username: "BacktrackingBeast",
      profileImage: "users/profile18.jpg",
      totalScore: 1967,
      timeTaken: "2h 28m 41s",
      attempts: 4,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 19,
      username: "GreedyGuru",
      profileImage: "users/profile19.jpg",
      totalScore: 1934,
      timeTaken: "2h 32m 18s",
      attempts: 2,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    },
    {
      rank: 20,
      username: "BitManipulator",
      profileImage: "users/profile20.jpg",
      totalScore: 1889,
      timeTaken: "2h 35m 54s",
      attempts: 6,
      status: "In Progress",
      coinsEarned: 0,
      isCurrentUser: false
    }
  ],
  totalParticipants: 1247,
  userRank: 7
};

// WebSocket Mock Data for real-time updates
export const mockWebSocketUpdates = [
  {
    type: 'leaderboard_update',
    data: {
      ...mockLeaderboard,
      rankings: mockLeaderboard.rankings.map(entry => ({
        ...entry,
        totalScore: entry.totalScore + Math.floor(Math.random() * 50),
        timeTaken: entry.status === 'In Progress' ?
          `${2 + Math.floor(Math.random())}h ${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}s` :
          entry.timeTaken
      }))
    }
  },
  {
    type: 'new_submission',
    data: {
      username: "NewContestant",
      rank: 21,
      totalScore: 1845,
      timeTaken: "2h 39m 12s"
    }
  },
  {
    type: 'participant_completed',
    data: {
      username: "TreeTraverser",
      rank: 13,
      status: "Completed",
      finalScore: 2156
    }
  }
];


