

import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Clock, Zap } from 'lucide-react';
import { imageKitService } from '../../services/ImageKitService'; 

const getContestThumbnail = (thumbnailKey: any) => {
  if (thumbnailKey) {
    return imageKitService.getProfileImageUrl(thumbnailKey, 400, 200, { radius: 8 });
  }
  return '/default-contest-thumbnail.jpg';
};

const formatTime = (dateString: any) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ActiveContestCard = ({ contest }: any) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/contest/${contest.contestNumber}`)}
      className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-green-500/30 hover:border-green-400 rounded-xl overflow-hidden w-full max-w-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/30"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-300 pointer-events-none"></div>
      
      <div className="relative h-56 overflow-hidden">
        <img
          src={getContestThumbnail(contest.thumbnail)}
          alt={contest.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-transparent to-blue-500/0 group-hover:from-green-500/20 group-hover:to-blue-500/10 transition-all duration-500"></div>
        
        <div className="absolute top-3 right-3">
          <div className="relative bg-gradient-to-r from-red-600 to-red-500 px-3 py-1.5 rounded-full shadow-2xl shadow-red-500/60 backdrop-blur-sm border border-red-400/30">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
            </div>
          </div>
        </div>

        <div className="absolute top-3 left-3">
          <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-400/40 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-white text-xs font-semibold">Active</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-2xl group-hover:text-green-300 transition-colors duration-300">
            {String(contest.title)}
          </h3>
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-sm border border-green-400/30 rounded-lg px-3 py-2 shadow-xl w-fit">
            <Clock className="h-4 w-4 text-white" />
            <div>
              <div className="text-sm font-bold text-white">{formatTime(contest.timeRemaining)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative p-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 border border-gray-700/60 rounded-lg p-2.5 group-hover:border-blue-500/40 group-hover:bg-gray-800/90 transition-all duration-300">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Participants</span>
            </div>
            <div className="text-base font-bold text-white">{String(contest.totalParticipants)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-yellow-600/40 rounded-lg p-2.5 group-hover:border-yellow-500/60 transition-all duration-300 shadow-lg shadow-yellow-900/20">
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Reward</span>
            </div>
            <div className="text-base font-bold text-yellow-400">{String(contest.maxReward)}</div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-900/50 group-hover:shadow-green-500/40">
          <span>Join Contest</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none"></div>
    </div>
  );
};

export default ActiveContestCard;