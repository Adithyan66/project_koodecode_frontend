import React from 'react';
import type { Problem } from '../../types/problem-list';

interface CodeProblemItemProps {
  problem: Problem;
  onClick?: () => void;
}

const CodeProblemItem: React.FC<CodeProblemItemProps> = ({ problem, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Med.':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getAcceptanceBarWidth = (acceptance: number) => {
    return `${acceptance}%`;
  };

  return (
    <div
      className="flex items-center py-3 px-4 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800"
      onClick={onClick}
    >
      <div className="w-12 text-gray-400 text-sm">
        {problem.status === 'solved' && (
          <span className="text-green-500">✓</span>
        )}
      </div>

      <div className="w-20 text-gray-400 text-sm">
        {problem.number}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-white hover:text-blue-400 transition-colors truncate">
          {problem.title}
        </div>
      </div>

      <div className="w-24 text-gray-400 text-sm text-right">
        {problem.acceptance}%
      </div>

      <div className={`w-24 text-sm font-medium text-right ${getDifficultyColor(problem.difficulty)}`}>
        {problem.difficulty}
      </div>

      <div className="w-32 ml-4">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-2 flex-1 bg-gray-700 rounded-full"
              style={{
                backgroundColor: idx < Math.ceil(problem.acceptance / 20) ? '#4ade80' : '#374151'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeProblemItem;

