


import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, Settings, Crown } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import httpClient from '../../services/axios/httpClient';

interface Problem {
    id: number;
    problemNumber:number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed: boolean;
    category?: string;
    tags?: string[];
}

const Problems: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>();

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const navigate = useNavigate();

    // Fetch problems from API
    const fetchProblems = async () => {
        setLoading(true);
        try {
            const params: any = {
                limit,
                search: search || undefined,
                difficulty: difficulty || undefined,
                category: category || undefined,
                tags: tags || undefined,
                sortBy
            };

            // Remove empty parameters
            Object.keys(params).forEach(key => {
                if (!params[key]) {
                    delete params[key];
                }
            });

            const response = await httpClient.get('user/problems/get-problems', { params });
            setProblems(response.data.data.problems);
            console.log("problems", response.data.data.problems);

        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchProblems();
    }, [limit, search, difficulty, category, tags, sortBy]);

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProblems();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const calendar = [
        [null, null, null, null, null, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23],
        [24, 25, 26, 27, 28, 29, 30],
        [31, null, null, null, null, null, null],
    ];

    // if (problems.length == 0) {
    //     console.log("workss for problem");

    //     return <h1>Loading........</h1>
    // }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Search and Filter Controls */}
                    <div className="mb-6 space-y-4">
                        {/* Top row - Search and Room buttons */}
                        {/* <div className="flex items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                                />
                            </div>
                            <div className="flex space-x-4 ml-6">
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                    Create Room
                                </button>
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                    Join Room
                                </button>
                            </div>
                        </div> */}

                        {/* Filter row */}
                        {/* <div className="flex items-center space-x-4">
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                            />

                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                            />

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                            >
                                <option value="id">Sort by ID</option>
                                <option value="title">Sort by Title</option>
                                <option value="difficulty">Sort by Difficulty</option>
                                <option value="category">Sort by Category</option>
                                <option value="createdAt">Sort by Date</option>
                            </select>

                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div> */}
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
                                        navigate(`/problem/${problem.id}`)
                                    }
                                    }
                                >
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-400 text-sm w-8">{problem.problemNumber}.</span>
                                        <div className="flex flex-col">
                                            <span className="text-white">{  problem.title}</span>
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

                    {/* Pagination dots */}
                    <div className="flex justify-center space-x-2 mt-8">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
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
