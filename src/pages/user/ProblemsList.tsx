import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import { useProblemsList } from '../../app/hooks/problem/useProblemsList';
import ProblemsBannerGrid from '../../components/problemsList/ProblemsBannerGrid';
import ProblemsFiltersBar from '../../components/problemsList/ProblemsFiltersBar';
import ProblemsTable from '../../components/problemsList/ProblemsTable';
import ProblemsSidebar from '../../components/problemsList/ProblemsSidebar';
import ProblemsListShimmer from '../../components/problemsList/ProblemsListShimmer';
import RotatingSpinner from '../../components/common/LoadingSpinner';

type DifficultyValue = 'all' | 'Easy' | 'Med.' | 'Hard';

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
        isProblemsLoading,
        isLoadingMore,
        observerRef,
        banners,
        stats,
        calendarData,
        toggleSort,
        isListDataLoading,
    } = useProblemsList();

    const handleProblemClick = (slug: string) => {
        navigate(`/problem/${slug}`);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
    };

    const handleDifficultyChange = (value: DifficultyValue) => {
        setDifficulty(value);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {isListDataLoading ? (
                <ProblemsListShimmer />
            ) : (
                <div className="max-w-[1400px] mx-auto px-6 py-8">
                    <ProblemsBannerGrid banners={banners} />

                    <div className="flex gap-6">
                        <div className="flex-1">
                            <ProblemsFiltersBar
                                search={search}
                                onSearchChange={handleSearchChange}
                                difficulty={difficulty}
                                onDifficultyChange={handleDifficultyChange}
                                stats={stats}
                            />

                            {isProblemsLoading ? (
                                <div className="flex items-center justify-center py-24">
                                    <RotatingSpinner fullscreen={false} />
                                </div>
                            ) : (
                                <ProblemsTable
                                    problems={problems}
                                    sortBy={sortBy}
                                    onToggleSort={toggleSort}
                                    onProblemClick={handleProblemClick}
                                    isLoadingMore={isLoadingMore}
                                    hasMore={hasMore}
                                    totalItems={totalItems}
                                    observerRef={observerRef}
                                />
                            )}
                        </div>

                        <ProblemsSidebar calendarData={calendarData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProblemsList;
