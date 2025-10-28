export interface BannerCard {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  bgGradient: string;
  image?: string;
}

export interface MockProblem {
  id: number;
  number: number;
  title: string;
  acceptance: number;
  difficulty: 'Easy' | 'Med.' | 'Hard';
  status?: 'solved' | 'attempted' | null;
}

export interface CalendarDay {
  date: number;
  solved: boolean;
  count?: number;
}

export interface ProblemsPageData {
  bannerCards: BannerCard[];
  problems: MockProblem[];
  solvedStats: {
    solved: number;
    total: number;
  };
  calendarData: CalendarDay[];
}

export const problemsPageMockData: ProblemsPageData = {
  bannerCards: [
    {
      id: 1,
      title: 'JavaScript',
      subtitle: '30 Days Challenge',
      buttonText: 'Start Learning',
      bgGradient: 'from-orange-500 to-red-500',
    },
    {
      id: 2,
      title: 'Top Interview',
      subtitle: 'Questions',
      buttonText: 'Get Started',
      bgGradient: 'from-blue-500 to-purple-500',
    },
    {
      id: 3,
      title: "LeetCode's Interview",
      subtitle: 'Crash Course:',
      buttonText: 'Start Learning',
      bgGradient: 'from-purple-600 to-pink-600',
    },
    {
      id: 4,
      title: "LeetCode's Interview",
      subtitle: 'Crash Course:',
      buttonText: 'Start Learning',
      bgGradient: 'from-green-600 to-teal-600',
    },
  ],

  problems: [
    { id: 3354, number: 3354, title: 'Make Array Elements Equal to Zero', acceptance: 68.1, difficulty: 'Easy', status: null },
    { id: 1, number: 1, title: 'Two Sum', acceptance: 56.5, difficulty: 'Easy', status: 'solved' },
    { id: 2, number: 2, title: 'Add Two Numbers', acceptance: 47.2, difficulty: 'Med.', status: null },
    { id: 3, number: 3, title: 'Longest Substring Without Repeating Characters', acceptance: 37.8, difficulty: 'Med.', status: null },
    { id: 4, number: 4, title: 'Median of Two Sorted Arrays', acceptance: 45.1, difficulty: 'Hard', status: null },
    { id: 5, number: 5, title: 'Longest Palindromic Substring', acceptance: 36.7, difficulty: 'Med.', status: null },
    { id: 6, number: 6, title: 'Zigzag Conversion', acceptance: 52.7, difficulty: 'Med.', status: null },
    { id: 7, number: 7, title: 'Reverse Integer', acceptance: 31.0, difficulty: 'Med.', status: null },
    { id: 8, number: 8, title: 'String to Integer (atoi)', acceptance: 20.0, difficulty: 'Med.', status: null },
    { id: 9, number: 9, title: 'Palindrome Number', acceptance: 59.8, difficulty: 'Easy', status: null },
    { id: 10, number: 10, title: 'Regular Expression Matching', acceptance: 29.9, difficulty: 'Hard', status: null },
    { id: 11, number: 11, title: 'Container With Most Water', acceptance: 54.3, difficulty: 'Med.', status: null },
    { id: 12, number: 12, title: 'Integer to Roman', acceptance: 62.1, difficulty: 'Med.', status: null },
    { id: 13, number: 13, title: 'Roman to Integer', acceptance: 61.4, difficulty: 'Easy', status: null },
    { id: 14, number: 14, title: 'Longest Common Prefix', acceptance: 42.8, difficulty: 'Easy', status: null },
    { id: 15, number: 15, title: '3Sum', acceptance: 34.2, difficulty: 'Med.', status: null },
    { id: 16, number: 16, title: '3Sum Closest', acceptance: 45.9, difficulty: 'Med.', status: null },
    { id: 17, number: 17, title: 'Letter Combinations of a Phone Number', acceptance: 58.7, difficulty: 'Med.', status: null },
    { id: 18, number: 18, title: '4Sum', acceptance: 38.5, difficulty: 'Med.', status: null },
    { id: 19, number: 19, title: 'Remove Nth Node From End of List', acceptance: 43.1, difficulty: 'Med.', status: null },
    { id: 20, number: 20, title: 'Valid Parentheses', acceptance: 41.2, difficulty: 'Easy', status: null },
    { id: 21, number: 21, title: 'Merge Two Sorted Lists', acceptance: 63.5, difficulty: 'Easy', status: null },
    { id: 22, number: 22, title: 'Generate Parentheses', acceptance: 73.8, difficulty: 'Med.', status: null },
    { id: 23, number: 23, title: 'Merge k Sorted Lists', acceptance: 51.2, difficulty: 'Hard', status: null },
    { id: 24, number: 24, title: 'Swap Nodes in Pairs', acceptance: 62.9, difficulty: 'Med.', status: null },
    { id: 25, number: 25, title: 'Reverse Nodes in k-Group', acceptance: 58.1, difficulty: 'Hard', status: null },
    { id: 26, number: 26, title: 'Remove Duplicates from Sorted Array', acceptance: 53.7, difficulty: 'Easy', status: null },
    { id: 27, number: 27, title: 'Remove Element', acceptance: 55.2, difficulty: 'Easy', status: null },
    { id: 28, number: 28, title: 'Find the Index of the First Occurrence', acceptance: 39.4, difficulty: 'Easy', status: null },
    { id: 29, number: 29, title: 'Divide Two Integers', acceptance: 17.3, difficulty: 'Med.', status: null },
    { id: 30, number: 30, title: 'Substring with Concatenation of All Words', acceptance: 32.1, difficulty: 'Hard', status: null },
    { id: 31, number: 31, title: 'Next Permutation', acceptance: 38.9, difficulty: 'Med.', status: null },
    { id: 32, number: 32, title: 'Longest Valid Parentheses', acceptance: 33.5, difficulty: 'Hard', status: null },
    { id: 33, number: 33, title: 'Search in Rotated Sorted Array', acceptance: 40.1, difficulty: 'Med.', status: null },
    { id: 34, number: 34, title: 'Find First and Last Position of Element', acceptance: 43.2, difficulty: 'Med.', status: null },
    { id: 35, number: 35, title: 'Search Insert Position', acceptance: 44.8, difficulty: 'Easy', status: null },
    { id: 36, number: 36, title: 'Valid Sudoku', acceptance: 60.3, difficulty: 'Med.', status: null },
    { id: 37, number: 37, title: 'Sudoku Solver', acceptance: 58.6, difficulty: 'Hard', status: null },
    { id: 38, number: 38, title: 'Count and Say', acceptance: 52.4, difficulty: 'Med.', status: null },
    { id: 39, number: 39, title: 'Combination Sum', acceptance: 70.2, difficulty: 'Med.', status: null },
    { id: 40, number: 40, title: 'Combination Sum II', acceptance: 54.7, difficulty: 'Med.', status: null },
    { id: 41, number: 41, title: 'First Missing Positive', acceptance: 37.6, difficulty: 'Hard', status: null },
    { id: 42, number: 42, title: 'Trapping Rain Water', acceptance: 60.9, difficulty: 'Hard', status: null },
    { id: 43, number: 43, title: 'Multiply Strings', acceptance: 39.2, difficulty: 'Med.', status: null },
    { id: 44, number: 44, title: 'Wildcard Matching', acceptance: 28.7, difficulty: 'Hard', status: null },
    { id: 45, number: 45, title: 'Jump Game II', acceptance: 40.5, difficulty: 'Med.', status: null },
    { id: 46, number: 46, title: 'Permutations', acceptance: 76.4, difficulty: 'Med.', status: null },
    { id: 47, number: 47, title: 'Permutations II', acceptance: 58.3, difficulty: 'Med.', status: null },
    { id: 48, number: 48, title: 'Rotate Image', acceptance: 72.1, difficulty: 'Med.', status: null },
    { id: 49, number: 49, title: 'Group Anagrams', acceptance: 67.8, difficulty: 'Med.', status: null },
    { id: 50, number: 50, title: 'Pow(x, n)', acceptance: 33.8, difficulty: 'Med.', status: null },
  ],

  solvedStats: {
    solved: 13,
    total: 3730,
  },

  calendarData: [
    { date: 5, solved: true, count: 2 },
    { date: 6, solved: true, count: 1 },
    { date: 7, solved: true, count: 3 },
    { date: 13, solved: true, count: 1 },
    { date: 14, solved: true, count: 2 },
    { date: 15, solved: true, count: 1 },
    { date: 16, solved: true, count: 1 },
    { date: 19, solved: true, count: 2 },
    { date: 20, solved: true, count: 1 },
    { date: 21, solved: true, count: 1 },
    { date: 22, solved: true, count: 1 },
    { date: 23, solved: true, count: 1 },
    { date: 27, solved: true, count: 1 },
    { date: 28, solved: true, count: 2 },
    { date: 29, solved: true, count: 3 },
    { date: 30, solved: true, count: 1 },
    { date: 31, solved: true, count: 1 },
  ],
};

