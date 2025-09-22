

import React from 'react';
import type{ Problem } from '../../../types/problem-list';

interface ActiveFiltersProps {
    difficulty: string;
    onClearDifficulty: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ difficulty, onClearDifficulty }) => {
    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500 bg-green-900/20';
            case 'Medium': return 'text-yellow-500 bg-yellow-900/20';
            case 'Hard': return 'text-red-500 bg-red-900/20';
            default: return 'text-gray-400';
        }
    };

    if (!difficulty) return null;

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Filtered by:</span>
            <span className={`text-sm px-2 py-1 rounded ${getDifficultyColor(difficulty)}`}>
                {difficulty}
            </span>
            <button
                onClick={onClearDifficulty}
                className="text-gray-400 hover:text-white text-sm"
            >
                ×
            </button>
        </div>
    );
};

export default ActiveFilters;