

import React from 'react';
import ProblemItem from './ProblemItem';
import LoadingSpinner from '../../common/LoadingSpinner';
import type{ Problem } from '../../../types/problem-list';

interface ProblemsListProps {
    problems: Problem[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

const ProblemsList: React.FC<ProblemsListProps> = ({
    problems,
    loading,
    loadingMore,
    hasMore,
    onLoadMore,
}) => {
    if (loading) {
        return (
            <div className="text-center py-8 text-gray-400">
                Loading problems...
            </div>
        );
    }

    if (problems.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                No problems found matching your criteria.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-1">
                {problems.map((problem, index) => (
                    <ProblemItem key={`${problem.id}-${index}`} problem={problem} index={index} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    {loadingMore ? (
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    ) : (
                        <button
                            onClick={onLoadMore}
                            className="px-6 py-2 bg-gray-800 text-green-500 rounded-lg border border-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        >
                            Load More Problems
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default ProblemsList;