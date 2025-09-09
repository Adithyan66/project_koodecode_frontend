

import React from 'react';

import type { UserStats } from '../../../types/profile';




interface ProblemStatsChartProps {
  stats: UserStats;
}

export const ProblemStatsChart: React.FC<ProblemStatsChartProps> = ({ stats }) => {
  const { easy, medium, hard } = stats.problemsByDifficulty;
  const total = easy + medium + hard;
  
  const easyPercentage = total > 0 ? (easy / total) * 100 : 0;
  const mediumPercentage = total > 0 ? (medium / total) * 100 : 0;
  const hardPercentage = total > 0 ? (hard / total) * 100 : 0;

  const difficultyData = [
    { 
      name: 'Easy', 
      count: easy, 
      percentage: easyPercentage,
      color: 'bg-green-500',
      gradientColor: 'from-green-500 to-green-600'
    },
    { 
      name: 'Medium', 
      count: medium, 
      percentage: mediumPercentage,
      color: 'bg-yellow-500',
      gradientColor: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Hard', 
      count: hard, 
      percentage: hardPercentage,
      color: 'bg-red-500',
      gradientColor: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Problem Solving Progress</h3>
      
      {/* Donut Chart */}
      <div className="flex items-center gap-8 mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-700"
            />
            
            {/* Easy problems arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={`${easyPercentage * 2.51} 251.2`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
            
            {/* Medium problems arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="8"
              strokeDasharray={`${mediumPercentage * 2.51} 251.2`}
              strokeDashoffset={`-${easyPercentage * 2.51}`}
              strokeLinecap="round"
            />
            
            {/* Hard problems arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray={`${hardPercentage * 2.51} 251.2`}
              strokeDashoffset={`-${(easyPercentage + mediumPercentage) * 2.51}`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-sm text-gray-400">Solved</div>
            </div>
          </div>
        </div>
        
        {/* Stats bars */}
        <div className="flex-1 space-y-6">
          {difficultyData.map((difficulty, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">{difficulty.name}</span>
                <span className="text-gray-400">{difficulty.count} ({difficulty.percentage.toFixed(1)}%)</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${difficulty.gradientColor} transition-all duration-500 ease-out`}
                  style={{ width: `${difficulty.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-700">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{easy}</div>
          <div className="text-sm text-gray-400">Easy</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">{medium}</div>
          <div className="text-sm text-gray-400">Medium</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">{hard}</div>
          <div className="text-sm text-gray-400">Hard</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{stats.acceptanceRate}%</div>
          <div className="text-sm text-gray-400">Acceptance</div>
        </div>
      </div>
    </div>
  );
};
