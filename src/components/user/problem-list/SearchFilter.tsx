

import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import type{ DifficultyOption } from '../../../types/problem-list';

interface SearchFilterProps {
    search: string;
    difficulty: string;
    onSearchChange: (search: string) => void;
    onDifficultyChange: (difficulty: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    search,
    difficulty,
    onSearchChange,
    onDifficultyChange,
}) => {
    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const difficultyOptions: DifficultyOption[] = [
        { value: '', label: 'All Difficulties' },
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDifficultyDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDifficultySelect = (selectedDifficulty: string) => {
        onDifficultyChange(selectedDifficulty);
        setShowDifficultyDropdown(false);
    };

    return (
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-12 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
            />

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2" ref={dropdownRef}>
                <button
                    onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                >
                    <Filter size={18} />
                </button>

                {showDifficultyDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                            {difficultyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleDifficultySelect(option.value)}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                                        difficulty === option.value
                                            ? 'bg-gray-700 text-green-500'
                                            : option.value
                                            ? getDifficultyColor(option.value)
                                            : 'text-gray-300'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchFilter;