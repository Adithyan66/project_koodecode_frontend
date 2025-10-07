




import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, AlertCircle, Loader } from 'lucide-react';
import { fetchProblemsThunk } from '../../../../features/room/roomThunks';
import { clearProblemsError, resetProblems, setProblemsSearchQuery } from '../../../../features/room/roomSlice';
import { useDebounce } from '../../../../utils/debounce';
import { useInfiniteScroll } from '../../../../app/hooks/problem/useInfiniteScroll';
// import type { RootState, AppDispatch } from '';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import type { AppDispatch, RootState } from '../../../../app/store';


interface ProblemSelectorProps {
  onSelectProblem: (problemNumber: number) => void;
  onClose: () => void;
  isChanging: boolean;
}

interface ProblemSummary {
  problemNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({
  onSelectProblem,
  onClose,
  isChanging
}) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    problems,
    problemsLoading,
    problemsError,
    problemsHasMore,
    currentProblemPage,
    currentSearchQuery
  } = useAppSelector((state: RootState) => state.room);

  // Fetch problems when component mounts or search changes
  useEffect(() => {
    // If search query changed, reset and fetch from page 1
    // if (debouncedSearch !== currentSearchQuery) {
      dispatch(setProblemsSearchQuery(debouncedSearch));
      dispatch(fetchProblemsThunk({
        page: 1,
        limit: 10,
        search: debouncedSearch
      }));
    // }
  }, [debouncedSearch, currentSearchQuery, dispatch]);

  // Load more problems for infinite scroll
  const loadMoreProblems = useCallback(() => {
    if (!problemsLoading && problemsHasMore) {
      dispatch(fetchProblemsThunk({
        page: currentProblemPage + 1,
        limit: 10,
        search: currentSearchQuery
      }));
    }
  }, [dispatch, problemsLoading, problemsHasMore, currentProblemPage, currentSearchQuery]);

  const { lastElementRef } = useInfiniteScroll({
    hasMore: problemsHasMore,
    isLoading: problemsLoading,
    onLoadMore: loadMoreProblems
  });

  const handleSelectProblem = (problemNumber: number) => {
    setSelectedProblem(problemNumber);
    onSelectProblem(problemNumber);
  };

  const handleClose = () => {
    dispatch(resetProblems());
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500 bg-green-500/10';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'Hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 w-96 max-h-96">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Select Problem</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search problems by title or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Problems List */}
      <div className="max-h-64 overflow-y-auto">
        {problemsError && (
          <div className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-red-400 mb-2">
              <AlertCircle size={16} />
              <span className="text-sm">Failed to load problems</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{problemsError}</p>
            <button
              onClick={() => {
                dispatch(clearProblemsError());
                dispatch(fetchProblemsThunk({
                  page: 1,
                  limit: 10,
                  search: currentSearchQuery
                }));
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!problemsError && problems.length === 0 && !problemsLoading && (
          <div className="p-4 text-center text-gray-400 text-sm">
            {searchQuery ? 'No problems found matching your search' : 'No problems available'}
          </div>
        )}

        {!problemsError && problems.length > 0 && (
          <div className="py-2">
            {problems.map((problem, index) => {
              const isLast = index === problems.length - 1;
              return (
                <div
                  key={problem.problemNumber}
                  ref={isLast ? lastElementRef : null}
                  onClick={() => handleSelectProblem(problem.problemNumber)}
                  className={`px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0 ${
                    selectedProblem === problem.problemNumber ? 'bg-blue-600/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {problem.problemNumber}.
                        </span>
                        <span className="text-white text-sm truncate">
                          {problem.title}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading indicator for pagination */}
            {problemsLoading && (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Loader className="animate-spin" size={16} />
                  <span className="text-sm">Loading more problems...</span>
                </div>
              </div>
            )}

            {/* End of list indicator */}
            {!problemsHasMore && problems.length > 0 && (
              <div className="p-3 text-center text-xs text-gray-500">
                No more problems to load
              </div>
            )}
          </div>
        )}

        {/* Initial loading state */}
        {problemsLoading && problems.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Loader className="animate-spin" size={20} />
              <span>Loading problems...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer with action buttons */}
      {selectedProblem && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={() => handleSelectProblem(selectedProblem)}
              disabled={isChanging}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm transition-colors"
            >
              {isChanging ? 'Changing...' : 'Select Problem'}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSelector;
