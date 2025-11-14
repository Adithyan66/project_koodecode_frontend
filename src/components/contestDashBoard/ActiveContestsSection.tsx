import { Clock } from 'lucide-react';
import ActiveContestCard from '../contests/ActiveContestCard';

interface ActiveContestsSectionProps {
  activeContest: any[];
  timeLeft: any;
  loadingActive: boolean;
}

const ActiveContestShimmer = () => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-green-500/30 rounded-xl overflow-hidden w-full max-w-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 pointer-events-none"></div>
      
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shimmer-animation">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        {/* Top Right Badge */}
        <div className="absolute top-3 right-3">
          <div className="relative bg-gray-700/80 backdrop-blur-sm rounded-full border border-gray-600/30 w-16 h-7">
            <div className="w-2 h-2 bg-gray-600 rounded-full ml-1.5 mt-2.5"></div>
          </div>
        </div>

        {/* Top Left Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-gray-700/70 backdrop-blur-md rounded-full border border-gray-600/40 w-20 h-7"></div>
        </div>

        {/* Bottom Title Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="h-6 bg-gray-700/60 rounded-lg mb-2 w-3/4 shimmer-animation"></div>
          <div className="h-8 bg-gray-700/60 rounded-lg w-32 shimmer-animation"></div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="relative p-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-800/80 border border-gray-700/60 rounded-lg p-2.5">
            <div className="h-3 bg-gray-700/60 rounded w-20 mb-2 shimmer-animation"></div>
            <div className="h-5 bg-gray-700/60 rounded w-12 shimmer-animation"></div>
          </div>
          
          <div className="bg-gray-800/80 border border-gray-700/60 rounded-lg p-2.5">
            <div className="h-3 bg-gray-700/60 rounded w-16 mb-2 shimmer-animation"></div>
            <div className="h-5 bg-gray-700/60 rounded w-10 shimmer-animation"></div>
          </div>
        </div>

        <div className="w-full h-10 bg-gray-700/60 rounded-lg shimmer-animation"></div>
      </div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none"></div>
    </div>
  );
};

const ActiveContestsSection = ({ activeContest, timeLeft, loadingActive }: ActiveContestsSectionProps) => {
  const getActiveContestGridClass = () => {
    const count = activeContest.length;
    if (count === 1) return 'grid grid-cols-1 justify-items-center max-w-2xl mx-auto';
    if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto';
    if (count === 3) return 'grid gap-6';
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  };

  return (
    <div className="mb-12">
      {loadingActive ? (
        <div className="grid grid-cols-1 justify-items-center max-w-2xl mx-auto">
          <ActiveContestShimmer />
        </div>
      ) : activeContest.length === 0 ? (
        <div className=" p-12 text-center">
          <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-gray-300 mb-2">No Active Contests</h3>
          <p className="text-gray-500">Check back later for upcoming contests</p>
        </div>
      ) : activeContest.length === 3 ? (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <ActiveContestCard contest={activeContest[0]} timeLeft={timeLeft} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActiveContestCard contest={activeContest[1]} timeLeft={timeLeft} />
            <ActiveContestCard contest={activeContest[2]} timeLeft={timeLeft} />
          </div>
        </div>
      ) : (
        <div className={getActiveContestGridClass()}>
          {activeContest.map((contest, index) => (
            <ActiveContestCard key={index} contest={contest} timeLeft={timeLeft} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveContestsSection;

