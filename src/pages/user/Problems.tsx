



import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Calendar, Settings, Crown } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import httpClient from '../../services/axios/httpClient';
import { useDebounce } from '../../utils/debounce';


interface Problem {
    id: number;
    problemNumber: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed: boolean;
    category?: string;
    tags?: string[];
    slug: string;
}

const Problems: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter states
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalProblems, setTotalProblems] = useState(0);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const PROBLEMS_PER_PAGE = 10;

    const difficultyOptions = [
        { value: '', label: 'All Difficulties' },
        { value: 'Easy', label: 'Easy' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Hard', label: 'Hard' }
    ];



    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDifficultyDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchProblems = async (pageNum: number = 1, isLoadMore: boolean = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setProblems([]);
        }

        try {
            const params: any = {
                search: search || undefined,
                difficulty: difficulty || undefined,
                page: pageNum,
                limit: PROBLEMS_PER_PAGE,
            };

            Object.keys(params).forEach(key => {
                if (!params[key]) {
                    delete params[key];
                }
            });

            const response = await httpClient.get('user/problems/get-problems', { params });
            const newProblems = response.data.data.problems;
            const total = response.data.data.total || 0;

            if (isLoadMore) {
                setProblems(prev => [...prev, ...newProblems]);
            } else {
                setProblems(newProblems);
                setTotalProblems(total);
            }

            const totalPages = Math.ceil(total / PROBLEMS_PER_PAGE);
            setHasMore(pageNum < totalPages);

            console.log("problems", newProblems);

        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };


    useEffect(() => {
        setPage(1);
        fetchProblems(1, false);
    }, [debouncedSearch, difficulty]);


    useEffect(() => {

        setPage(1);
        fetchProblems(1, false);

    }, [debouncedSearch]);

    const handleDifficultySelect = (selectedDifficulty: string) => {
        setDifficulty(selectedDifficulty);
        setShowDifficultyDropdown(false);
    };

    const loadMoreProblems = () => {
        if (hasMore && !loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProblems(nextPage, true);
        }
    };

    const calendar = [
        [null, null, null, null, null, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29, 30],
        [31, null, null, null, null, null, null],
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Search and Filter Controls */}
                    <div className="mb-6 space-y-4">
                        {/* Top row - Search and Room buttons */}
                        <div className="flex items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-gray-800 text-white pl-10 pr-12 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                                />

                                {/* Filter Icon inside search box */}
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
                                        className="text-gray-400 hover:text-green-500 transition-colors"
                                    >
                                        <Filter size={18} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showDifficultyDropdown && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                                            <div className="py-1">
                                                {difficultyOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleDifficultySelect(option.value)}
                                                        className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${difficulty === option.value
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

                            <div className="flex space-x-4 ml-6">
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                    Create Room
                                </button>
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                    Join Room
                                </button>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {difficulty && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">Filtered by:</span>
                                <span className={`text-sm px-2 py-1 bg-gray-800 rounded ${getDifficultyColor(difficulty)}`}>
                                    {difficulty}
                                </span>
                                <button
                                    onClick={() => setDifficulty('')}
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Problems List */}
                    <div className="space-y-1">
                        {loading ? (
                            <div className="text-center py-8 text-gray-400">
                                Loading problems...
                            </div>
                        ) : problems.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No problems found matching your criteria.
                            </div>
                        ) : (
                            problems.map((problem, index) => (
                                <div
                                    key={`${problem.id}-${index}`}
                                    className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors cursor-pointer"
                                    onClick={() => {
                                        navigate(`/problem/${problem.slug}`)
                                    }}
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
                            ))
                        )}
                    </div>

                    {/* Load More / Pagination */}
                    {hasMore && problems.length > 0 && (
                        <div className="flex justify-center mt-8">
                            {loadingMore ? (
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            ) : (
                                <button
                                    onClick={loadMoreProblems}
                                    className="px-6 py-2 bg-gray-800 text-green-500 rounded-lg border border-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                >
                                    Load More Problems
                                </button>
                            )}
                        </div>
                    )}

                    {/* End of results indicator */}
                    {!hasMore && problems.length > 0 && (
                        <div className="text-center py-4 text-gray-400">
                            <p>You've reached the end of the problems list</p>
                            <p className="text-sm">Showing {problems.length} of {totalProblems} problems</p>
                        </div>
                    )}

                    {/* Pagination dots for loading state */}
                    {!loading && !loadingMore && problems.length > 0 && (
                        <div className="flex justify-center space-x-2 mt-8">
                            <div className={`w-2 h-2 rounded-full ${page >= 1 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                            <div className={`w-2 h-2 rounded-full ${page >= 2 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                            <div className={`w-2 h-2 rounded-full ${page >= 3 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="w-80 bg-gray-800 p-6 space-y-6">
                    {/* Calendar Widget */}
                    <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-400">Day 2</span>
                            <button>
                                <Settings size={16} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="text-gray-500 p-1">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-xs">
                            {calendar.map((week, weekIndex) =>
                                week.map((day, dayIndex) => (
                                    <div key={`${weekIndex}-${dayIndex}`} className="p-1 h-8 flex items-center justify-center">
                                        {day && (
                                            <div className={`w-6 h-6 rounded flex items-center justify-center ${day === 5 ? 'bg-green-500 text-white' :
                                                day === 6 ? 'bg-green-600 text-white' :
                                                    'text-gray-400 hover:bg-gray-700'
                                                }`}>
                                                {day}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Premium Widget */}
                    <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Crown size={16} className="text-yellow-500" />
                                <span className="text-sm text-yellow-500">Weekly Premium</span>
                            </div>
                            <span className="text-xs text-gray-400">5 days left</span>
                        </div>

                        <div className="grid grid-cols-5 gap-1">
                            {['Mo', 'Tu', 'We', 'Th', 'Fr'].map((day, index) => (
                                <div key={day} className="text-center">
                                    <div className="text-xs text-gray-400 mb-1">{day}</div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-yellow-500' : 'bg-gray-700'
                                        }`}>
                                        <Crown size={12} className={index === 0 ? 'text-black' : 'text-gray-500'} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Room Status */}
                    <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-500">Random</span>
                            <span className="text-xs text-gray-400 ml-auto">Rules</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problems;
