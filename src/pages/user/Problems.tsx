import React, { useState } from 'react';
import { Search, User, Calendar, Settings, Crown } from 'lucide-react';
import Navbar from '../../components/user/Navbar';
import { useNavigate } from 'react-router-dom';

interface Problem {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed: boolean;
}

const Problems: React.FC = () => {
    const [problems] = useState<Problem[]>([
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: true },
        { id: 2, title: "Add Two Numbers", difficulty: "Hard", completed: false },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: false },
        { id: 4, title: "Medium of Two Sorted Arrays", difficulty: "Medium", completed: true },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: true },
        { id: 1, title: "Two Sum", difficulty: "Hard", completed: false },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: true },
        { id: 1, title: "Two Sum", difficulty: "Medium", completed: false },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: false },
        { id: 1, title: "Two Sum", difficulty: "Medium", completed: false },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: true },
        { id: 1, title: "Two Sum", difficulty: "Hard", completed: true },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: false },
        { id: 1, title: "Two Sum", difficulty: "Easy", completed: false },
    ]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const navigate = useNavigate()

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
                    {/* Search and Room Controls */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                    <div className="w-3 h-0.5 bg-gray-400"></div>
                                    <div className="w-3 h-0.5 bg-gray-400 ml-0.5"></div>
                                    <div className="w-3 h-0.5 bg-gray-400 ml-0.5"></div>
                                </div>
                            </button>
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

                    {/* Problems List */}
                    <div className="space-y-1">
                        {problems.map((problem, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-750 transition-colors"
                                onClick={() => navigate(`/problem/${problem.id}`)}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-400 text-sm w-4">{problem.id}.</span>
                                    <span className="text-white">{problem.title}</span>
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
                        ))}
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