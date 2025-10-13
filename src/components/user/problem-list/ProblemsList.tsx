




import React from 'react';
import ProblemItem from './ProblemItem';
import type { Problem } from '../../../types/problem-list';

interface ProblemsListProps {
    problems: Problem[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    observerRef: React.RefObject<HTMLDivElement | null>;
}

const ProblemsList: React.FC<ProblemsListProps> = ({
    problems,
    loading,
    loadingMore,
    hasMore,
    observerRef,
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

            {/* Infinite Scroll Trigger Element */}
            {hasMore && (
                <div 
                    ref={observerRef}
                    className="flex justify-center mt-8 py-4"
                >
                    {loadingMore ? (
                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <p className="text-gray-400 text-sm">Loading more problems...</p>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm">
                            Scroll down to load more problems
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ProblemsList;
