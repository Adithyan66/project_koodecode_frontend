import React from 'react';
import CodeProblemItem from './CodeProblemItem';
import type { Problem } from '../../types/problem-list';

type SortBy = 'none' | 'acceptance-asc' | 'acceptance-desc';

type ProblemsTableProps = {
    problems: Problem[];
    sortBy: SortBy;
    onToggleSort: () => void;
    onProblemClick: (slug: string) => void;
    isLoadingMore: boolean;
    hasMore: boolean;
    totalItems: number;
    observerRef: React.RefObject<HTMLDivElement>;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({
    problems,
    sortBy,
    onToggleSort,
    onProblemClick,
    isLoadingMore,
    hasMore,
    totalItems,
    observerRef
}) => (
    <>
        <div className="bg-gray-900 rounded-xl overflow-hidden">
            <div className="flex items-center py-3 px-4 bg-gray-800 border-b border-gray-700 text-gray-400 text-sm font-medium">
                <div className="w-12">Status</div>
                <div className="w-20">No.</div>
                <div className="flex-1">Title</div>
                <div
                    className="w-24 text-right cursor-pointer hover:text-white transition-colors flex items-center justify-end space-x-1"
                    onClick={onToggleSort}
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

            {problems.length > 0 ? (
                <div className="divide-y divide-gray-800">
                    {problems.map(problem => (
                        <CodeProblemItem
                            key={problem.id}
                            problem={problem}
                            onClick={() => onProblemClick(problem.slug)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400">
                    <p>No problems found matching your criteria</p>
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

        {!hasMore && problems.length > 0 && (
            <div className="text-center py-8 text-gray-400">
                <p>You've reached the end of the list</p>
                <p className="text-sm mt-1">Showing {problems.length} of {totalItems} problems</p>
            </div>
        )}

        {hasMore && <div ref={observerRef} className="h-10 w-full" />}
    </>
);

export default ProblemsTable;
