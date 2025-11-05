import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContestPaginationProps {
  pastPage: number;
  totalPages: number;
  pastLimit: number;
  pastTotal: number;
  onPageChange: (page: number) => void;
}

const ContestPagination = ({
  pastPage,
  totalPages,
  pastLimit,
  pastTotal,
  onPageChange,
}: ContestPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700/50">
      <div className="text-sm text-gray-400">
        Showing {((pastPage - 1) * pastLimit) + 1} to {Math.min(pastPage * pastLimit, pastTotal)} of {pastTotal} contests
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, pastPage - 1))}
          disabled={pastPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
            pastPage === 1
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-green-500/50'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 ${
                pastPage === page
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 hover:border-green-500/50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, pastPage + 1))}
          disabled={pastPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
            pastPage === totalPages
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-green-500/50'
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ContestPagination;

