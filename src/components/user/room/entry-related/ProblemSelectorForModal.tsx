

// src/components/user/rooms/ProblemSelectorForModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, AlertCircle, Loader, X } from 'lucide-react';
import httpClient from '../../../../services/axios/httpClient';

interface Problem {
  problemNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface ProblemSelectorForModalProps {
  onSelectProblem: (problem: Problem) => void;
  onClose: () => void;
  isChanging?: boolean;
}

const ProblemSelectorForModal: React.FC<ProblemSelectorForModalProps> = ({
  onSelectProblem,
  onClose,
  isChanging = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProblems = useCallback(async (pageNum: number = 1, search: string = '') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await httpClient.get('/user/problems', {
        params: {
          page: pageNum,
          limit: 20,
          search: search.trim()
        }
      });

      if (response.data.success) {
        const newProblems = response.data.problems || [];
        
        if (pageNum === 1) {
          setProblems(newProblems);
        } else {
          setProblems(prev => [...prev, ...newProblems]);
        }
        
        setHasMore(newProblems.length === 20);
        setPage(pageNum);
      } else {
        setError('Failed to load problems');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems(1, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchProblems]);

  const loadMoreProblems = () => {
    if (!loading && hasMore) {
      fetchProblems(page + 1, searchQuery);
    }
  };

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleConfirmSelection = () => {
    if (selectedProblem) {
      onSelectProblem(selectedProblem);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Hard':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 max-h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium">Select Problem</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by title or problem number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
      </div>

      {/* Problems List */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-red-400 mb-2">
              <AlertCircle size={16} />
              <span className="text-sm">Failed to load problems</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{error}</p>
            <button
              onClick={() => fetchProblems(1, searchQuery)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!error && problems.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-400 text-sm">
            {searchQuery ? 'No problems found matching your search' : 'No problems available'}
          </div>
        )}

        {!error && problems.length > 0 && (
          <div className="py-2">
            {problems.map((problem, index) => (
              <div
                key={`${problem.problemNumber}-${index}`}
                onClick={() => handleSelectProblem(problem)}
                className={`px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0 ${
                  selectedProblem?.problemNumber === problem.problemNumber ? 'bg-green-600/20 border-l-4 border-l-green-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-green-400 font-medium text-sm">
                        #{problem.problemNumber}
                      </span>
                      <span className="text-white text-sm truncate font-medium">
                        {problem.title}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMoreProblems}
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                  Load more problems...
                </button>
              </div>
            )}

            {/* Loading indicator for pagination */}
            {loading && problems.length > 0 && (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Loader className="animate-spin" size={16} />
                  <span className="text-sm">Loading more problems...</span>
                </div>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && problems.length > 0 && !loading && (
              <div className="p-3 text-center text-xs text-gray-500">
                No more problems to load
              </div>
            )}
          </div>
        )}

        {/* Initial loading state */}
        {loading && problems.length === 0 && (
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
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="mb-3 p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">Selected:</p>
                <p className="text-green-400 text-sm">
                  #{selectedProblem.problemNumber} - {selectedProblem.title}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}>
                {selectedProblem.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleConfirmSelection}
              disabled={isChanging}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isChanging ? 'Selecting...' : 'Select This Problem'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemSelectorForModal;
