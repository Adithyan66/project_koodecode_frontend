import { TrendingUp } from 'lucide-react';
import ContestListItem from '../contests/ContestListItem';
import ContestPagination from './ContestPagination';

interface PastContestsListProps {
  pastContests: any[];
  loadingPast: boolean;
  pastSearchTerm: string;
  pastPage: number;
  totalPages: number;
  pastLimit: number;
  pastTotal: number;
  onPageChange: (page: number) => void;
}

const PastContestShimmer = () => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700/50 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/0 to-gray-800/0 pointer-events-none"></div>
      
      <div className="flex gap-4 p-4">
        {/* Image Thumbnail */}
        <div className="relative flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shimmer-animation">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
          
          {/* Top Left Badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-gray-700/70 backdrop-blur-md rounded-lg border border-gray-600/40 w-16 h-7"></div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Title */}
            <div className="h-6 bg-gray-700/60 rounded-lg mb-2 w-3/4 shimmer-animation"></div>
            
            {/* Description */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700/60 rounded w-full shimmer-animation"></div>
              <div className="h-4 bg-gray-700/60 rounded w-5/6 shimmer-animation"></div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Calendar Badge */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-lg px-3 py-2 w-28 h-9 shimmer-animation"></div>
              
              {/* Users Badge */}
              <div className="bg-gray-800/60 border border-gray-700/60 rounded-lg px-3 py-2 w-20 h-9 shimmer-animation"></div>
            </div>

            {/* Results Button */}
            <div className="flex-shrink-0 w-24 h-9 bg-gray-700/60 rounded-lg shimmer-animation"></div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none"></div>
    </div>
  );
};

const PastContestsList = ({
  pastContests,
  loadingPast,
  pastSearchTerm,
  pastPage,
  totalPages,
  pastLimit,
  pastTotal,
  onPageChange,
}: PastContestsListProps) => {
  if (loadingPast) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <PastContestShimmer key={i} />
        ))}
      </div>
    );
  }

  if (pastContests.length === 0) {
    return (
      <div className=" p-12 text-center">
        <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Past Contests</h3>
        <p className="text-gray-500">
          {pastSearchTerm ? 'No contests match your search' : 'Completed contests will appear here'}
        </p>
      </div>
    );
  }

  return (
    <>
      {pastContests.map((contest, index) => (
        <div key={index} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10">
          <ContestListItem
            contest={contest}
            isPast={true}
            onRegister={() => {}}
          />
        </div>
      ))}

      <ContestPagination
        pastPage={pastPage}
        totalPages={totalPages}
        pastLimit={pastLimit}
        pastTotal={pastTotal}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default PastContestsList;

