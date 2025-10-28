
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import BannerCard from '../../components/user/problem-list/BannerCard';
import CodeCalendar from '../../components/user/problem-list/CodeCalendar';
import CodeProblemItem from '../../components/user/problem-list/CodeProblemItem';
import { useProblemsList } from '../../app/hooks/problem/useProblemsList';

const ProblemsList: React.FC = () => {
    const navigate = useNavigate();

    const {
        search,
        setSearch,
        difficulty,
        setDifficulty,
        sortBy,
        problems,
        hasMore,
        totalItems,
        isLoading,
        isLoadingMore,
        observerRef,
        banners,
        stats,
        calendarData,
        toggleSort,
    } = useProblemsList();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {banners.map(card => (
                        <BannerCard key={card.id} card={card} />
                    ))}
                </div>

                <div className="flex gap-6">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search questions"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
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
                                        onChange={(e) => setDifficulty(e.target.value as any)}
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

                        <div className="bg-gray-900 rounded-xl overflow-hidden">
                            <div className="flex items-center py-3 px-4 bg-gray-800 border-b border-gray-700 text-gray-400 text-sm font-medium">
                                <div className="w-12">Status</div>
                                <div className="w-20">No.</div>
                                <div className="flex-1">Title</div>
                                <div
                                    className="w-24 text-right cursor-pointer hover:text-white transition-colors flex items-center justify-end space-x-1"
                                    onClick={toggleSort}
                                >
                                    <span>Acceptance</span>
                                    {sortBy !== 'none' && (
                                        <span className="text-green-500 text-base">
                                            {sortBy === 'acceptance-desc' ? '↓' : '↑'}
                                        </span>
                                    )}
                                </div>
                                <div className="w-24 text-right">Difficulty</div>
                                <div className="w-32 ml-4"></div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center space-x-2">
                                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-gray-400">Loading problems...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-800">
                                    {problems.map(problem => (
                                        <CodeProblemItem
                                            key={problem.id}
                                            problem={problem}
                                            onClick={() => navigate(`/problem/${problem.slug}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {isLoadingMore && (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-400">Loading more problems...</span>
                                </div>
                            </div>
                        )}

                        {!hasMore && problems.length > 0 && !isLoading && (
                            <div className="text-center py-8 text-gray-400">
                                <p>You've reached the end of the list</p>
                                <p className="text-sm mt-1">Showing {problems.length} of {totalItems} problems</p>
                            </div>
                        )}

                        {problems.length === 0 && !isLoading && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No problems found matching your criteria</p>
                            </div>
                        )}

                        {hasMore && <div ref={observerRef} className="h-10 w-full" />}
                    </div>

                    <div className="w-80">
                        <CodeCalendar calendarData={calendarData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemsList;
