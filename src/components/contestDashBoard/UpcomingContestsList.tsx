import { Calendar } from 'lucide-react';
import ContestListItem from '../contests/ContestListItem';

interface UpcomingContestsListProps {
  upcomingContests: any[];
  loadingUpcoming: boolean;
  onRegister: (contest: any) => void;
}

const UpcomingContestShimmer = () => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-green-500/30 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 pointer-events-none"></div>
      
      <div className="flex gap-4 p-4">
        {/* Image Thumbnail */}
        <div className="relative flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shimmer-animation">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          
          {/* Top Left Badge */}
          <div className="absolute top-2 left-2">
            <div className="bg-gray-700/70 backdrop-blur-md rounded-lg border border-gray-600/40 w-20 h-7"></div>
          </div>

          {/* Bottom Right Badge */}
          <div className="absolute bottom-2 right-2">
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

            {/* Register Button */}
            <div className="flex-shrink-0 w-32 h-9 bg-gray-700/60 rounded-lg shimmer-animation"></div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
    </div>
  );
};

const UpcomingContestsList = ({ upcomingContests, loadingUpcoming, onRegister }: UpcomingContestsListProps) => {
  if (loadingUpcoming) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <UpcomingContestShimmer key={i} />
        ))}
      </div>
    );
  }

  if ((upcomingContests || []).length === 0) {
    return (
      <div className=" p-12 text-center">
        <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Upcoming Contests</h3>
        <p className="text-gray-500">New contests will appear here</p>
      </div>
    );
  }

  return (
    <>
      {(upcomingContests || []).map((contest, index) => (
        <div key={index} className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/10">
          <ContestListItem
            contest={contest}
            isPast={false}
            onRegister={onRegister}
          />
        </div>
      ))}
    </>
  );
};

export default UpcomingContestsList;

