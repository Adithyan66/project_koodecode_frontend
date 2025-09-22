

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type{ Problem } from '../../../types/problem-list';

interface ProblemItemProps {
    problem: Problem;
    index: number;
}

const ProblemItem: React.FC<ProblemItemProps> = ({ problem, index }) => {
    const navigate = useNavigate();

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    return (
        <div
            className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => navigate(`/problem/${problem.slug}`)}
        >
            <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm w-8">{problem.problemNumber}.</span>
                <div className="flex flex-col">
                    <span className="text-white">{problem.title}</span>
                    {problem.category && (
                        <span className="text-xs text-gray-500">{problem.category}</span>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                </span>
                {problem.completed && (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemItem;