import React from 'react';

type DifficultyValue = 'all' | 'Easy' | 'Med.' | 'Hard';

type ProblemsFiltersBarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    difficulty: DifficultyValue;
    onDifficultyChange: (value: DifficultyValue) => void;
    stats: { solved: number; total: number };
};

const ProblemsFiltersBar: React.FC<ProblemsFiltersBarProps> = ({
    search,
    onSearchChange,
    difficulty,
    onDifficultyChange,
    stats
}) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search questions"
                    value={search}
                    onChange={event => onSearchChange(event.target.value)}
                    className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
                <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            <div className="relative group">
                <select
                    value={difficulty}
                    onChange={event => onDifficultyChange(event.target.value as DifficultyValue)}
                    className="px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer appearance-none font-medium shadow-md pr-8"
                >
                    <option value="all" className="bg-slate-800">All Difficulty</option>
                    <option value="Easy" className="bg-slate-800 text-green-400">Easy</option>
                    <option value="Med." className="bg-slate-800 text-yellow-400">Medium</option>
                    <option value="Hard" className="bg-slate-800 text-red-400">Hard</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>

        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">
                    {stats.solved}/{stats.total} Solved
                </span>
            </div>
        </div>
    </div>
);

export default ProblemsFiltersBar;
