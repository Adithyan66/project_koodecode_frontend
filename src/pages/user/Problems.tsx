



import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import ProblemsList from '../../components/user/problem-list/ProblemsList';
import SearchFilter from '../../components/user/problem-list/SearchFilter';
import ActiveFilters from '../../components/user/problem-list/ActiveFilters';
import Sidebar from '../../components/user/problem-list/Sidebar';
import { useProblems } from '../../app/hooks/problem/useProblems';

const Problems: React.FC = () => {
    const {
        problems,
        loading,
        loadingMore,
        hasMore,
        totalProblems,
        search,
        difficulty,
        setSearch,
        setDifficulty,
        observerRef, 
    } = useProblems();

    const navigate = useNavigate();

    const handleClearDifficulty = () => {
        setDifficulty('');
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    {/* Search and Filter Controls */}
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <SearchFilter
                                search={search}
                                difficulty={difficulty}
                                onSearchChange={setSearch}
                                onDifficultyChange={setDifficulty}
                            />

                            <div className="flex space-x-4 ml-6">
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                    Create Room
                                </button>
                                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors">
                                    Join Room
                                </button>
                            </div>
                        </div>

                        <ActiveFilters
                            difficulty={difficulty}
                            onClearDifficulty={handleClearDifficulty}
                        />
                    </div>

                    {/* Problems List with Infinite Scroll */}
                    <ProblemsList
                        problems={problems}
                        loading={loading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        observerRef={observerRef} 
                    />

                    {/* End of results indicator */}
                    {!hasMore && problems.length > 0 && (
                        <div className="text-center py-4 text-gray-400">
                            <p>You've reached the end of the problems list</p>
                            <p className="text-sm">Showing {problems.length} of {totalProblems} problems</p>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <Sidebar />
            </div>
        </div>
    );
};

export default Problems;
