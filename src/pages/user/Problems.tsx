
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '../../components/user/Navbar';
import BannerCard from '../../components/user/problem-list/BannerCard';
import LeetCodeCalendar from '../../components/user/problem-list/LeetCodeCalendar';
import LeetCodeProblemItem from '../../components/user/problem-list/LeetCodeProblemItem';
import { problemsPageMockData } from '../../data/problemsMockData';

const ITEMS_PER_PAGE = 10;

const Problems: React.FC = () => {
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<'all' | 'Easy' | 'Med.' | 'Hard'>('all');
    const [sortBy, setSortBy] = useState<'none' | 'acceptance-asc' | 'acceptance-desc'>('none');
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    const { bannerCards, problems, solvedStats, calendarData } = problemsPageMockData;

    const filteredAndSortedProblems = useMemo(() => {
        let filtered = problems.filter(problem => {
            const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase()) || 
                                 problem.number.toString().includes(search);
            const matchesDifficulty = difficulty === 'all' || problem.difficulty === difficulty;
            return matchesSearch && matchesDifficulty;
        });

        if (sortBy === 'acceptance-asc') {
            filtered = [...filtered].sort((a, b) => a.acceptance - b.acceptance);
        } else if (sortBy === 'acceptance-desc') {
            filtered = [...filtered].sort((a, b) => b.acceptance - a.acceptance);
        }

        return filtered;
    }, [problems, search, difficulty, sortBy]);

    const displayedProblems = useMemo(() => {
        return filteredAndSortedProblems.slice(0, displayedCount);
    }, [filteredAndSortedProblems, displayedCount]);

    const hasMore = displayedCount < filteredAndSortedProblems.length;

    useEffect(() => {
        setDisplayedCount(ITEMS_PER_PAGE);
        setIsLoading(false);
        isLoadingRef.current = false;
    }, [search, difficulty, sortBy]);

    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const entry = entries[0];
            
            if (entry.isIntersecting && !isLoadingRef.current) {
                const currentDisplayed = displayedCount;
                const totalFiltered = filteredAndSortedProblems.length;
                
                if (currentDisplayed >= totalFiltered) {
                    return;
                }

                isLoadingRef.current = true;
                setIsLoading(true);

                setTimeout(() => {
                    setDisplayedCount(prev => {
                        const newCount = Math.min(prev + ITEMS_PER_PAGE, totalFiltered);
                        console.log(`Loading more: ${prev} -> ${newCount} of ${totalFiltered}`);
                        return newCount;
                    });
                    
                    setTimeout(() => {
                        setIsLoading(false);
                        isLoadingRef.current = false;
                    }, 100);
                }, 800);
            }
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '200px'
        });

        const currentObserver = observerRef.current;
        if (currentObserver) {
            observer.observe(currentObserver);
        }

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver);
            }
        };
    }, [displayedCount, filteredAndSortedProblems.length]);

    const toggleSort = () => {
        if (sortBy === 'none') setSortBy('acceptance-desc');
        else if (sortBy === 'acceptance-desc') setSortBy('acceptance-asc');
        else setSortBy('none');
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {bannerCards.map(card => (
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

                                <div className="relative">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value as any)}
                                        className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer pr-8 appearance-none"
                                    >
                                        <option value="all">All Difficulty</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Med.">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    <svg className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded" />
                                    <span className="text-gray-400 text-sm">
                                        {solvedStats.solved}/{solvedStats.total} Solved
                                    </span>
                                </div>
                                <button className="p-2 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
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

                            <div className="divide-y divide-gray-800">
                                {displayedProblems.map(problem => (
                                    <LeetCodeProblemItem
                                        key={problem.id}
                                        problem={problem}
                                        onClick={() => console.log('Problem clicked:', problem.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {isLoading && (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-gray-400">Loading more problems...</span>
                                </div>
                            </div>
                        )}

                        {!hasMore && displayedProblems.length > 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <p>You've reached the end of the list</p>
                                <p className="text-sm mt-1">Showing {displayedProblems.length} of {filteredAndSortedProblems.length} problems</p>
                            </div>
                        )}

                        {displayedProblems.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No problems found matching your criteria</p>
                            </div>
                        )}

                        {hasMore && <div ref={observerRef} className="h-10 w-full" />}
                    </div>

                    <div className="w-80">
                        <LeetCodeCalendar calendarData={calendarData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problems;
