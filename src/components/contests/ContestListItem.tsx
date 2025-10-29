

import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Eye, Trophy, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
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

const ContestListItem = ({ contest, isPast, onRegister }: any) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/contest/${contest.contestNumber}`)}
      className={`group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 ${
        isPast 
          ? 'border-gray-700/50 hover:border-gray-600' 
          : 'border-green-500/30 hover:border-green-500/60'
      } rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isPast 
          ? 'hover:shadow-gray-700/20' 
          : 'hover:shadow-green-500/30'
      } hover:scale-[1.01]`}
    >
      <div className="flex gap-4 p-4">
        <div className="relative flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden group/thumb">
          <img
            src={getContestThumbnail(contest.thumbnail)}
            alt={contest.title}
            className="w-full h-full object-cover transform group-hover/thumb:scale-110 transition-transform duration-700 ease-out"
          />
          
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isPast 
              ? 'from-gray-900 via-gray-900/30 to-transparent' 
              : 'from-black via-black/30 to-transparent'
          }`}></div>
          
          <div className={`absolute inset-0 bg-gradient-to-br ${
            isPast 
              ? 'from-gray-700/0 via-transparent to-gray-800/0 group-hover:from-gray-700/20 group-hover:to-gray-800/10' 
              : 'from-green-500/0 via-transparent to-blue-500/0 group-hover:from-green-500/20 group-hover:to-blue-500/10'
          } transition-all duration-500`}></div>
          
          {isPast ? (
            <div className="absolute top-2 left-2 bg-gray-800/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-600/50 shadow-lg">
              <span className="text-gray-300 text-xs font-bold uppercase tracking-wide">Ended</span>
            </div>
          ) : (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-green-600/95 to-emerald-600/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-green-400/50 shadow-xl">
              <span className="text-white text-xs font-bold uppercase tracking-wide">Upcoming</span>
            </div>
          )}

          {!isPast && (
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-600/95 to-orange-600/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-yellow-500/40 shadow-lg">
              <Trophy className="h-3.5 w-3.5 text-yellow-200" />
              <span className="text-white text-xs font-bold">{String(contest.maxReward)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className={`text-xl font-bold line-clamp-1 ${
                isPast 
                  ? 'text-gray-300 group-hover:text-white' 
                  : 'text-white group-hover:text-green-400'
              } transition-colors duration-300`}>
                {String(contest.title)}
              </h3>
              
              {isPast && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/contests/${contest.id}/results`);
                  }}
                  className="flex-shrink-0 flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors bg-blue-900/20 hover:bg-blue-900/40 px-3 py-2 rounded-lg border border-blue-500/30 hover:border-blue-500/50"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-xs font-semibold">Results</span>
                </button>
              )}
            </div>

            {contest.description && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{String(contest.description)}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                isPast 
                  ? 'bg-gray-800/60 border border-gray-700/60' 
                  : 'bg-gray-800/60 border border-green-500/20'
              }`}>
                <Calendar className={`h-4 w-4 ${isPast ? 'text-gray-500' : 'text-green-400'}`} />
                <span className="text-xs text-gray-300 font-medium">{formatTime(contest.startTime.toString())}</span>
              </div>
              
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                isPast 
                  ? 'bg-gray-800/60 border border-gray-700/60' 
                  : 'bg-gray-800/60 border border-green-500/20'
              }`}>
                <Users className={`h-4 w-4 ${isPast ? 'text-gray-500' : 'text-blue-400'}`} />
                <span className="text-xs text-gray-300 font-medium">{String(contest.totalParticipants)}</span>
              </div>
            </div>

            {!isPast && (
              <div className="flex-shrink-0">
                {contest.isRegistered ? (
                  <div className="flex items-center gap-2 bg-green-900/50 border-2 border-green-500/60 text-green-400 px-4 py-2 rounded-lg text-sm font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Registered</span>
                  </div>
                ) : contest.canRegister ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegister(contest.id);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg shadow-green-900/30 hover:shadow-green-500/40 flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Register Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-700/50 border border-gray-600/50 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium">
                    <XCircle className="h-4 w-4" />
                    <span>Closed</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`absolute inset-0 rounded-xl ring-1 ring-inset ${
        isPast ? 'ring-white/5' : 'ring-white/10'
      } pointer-events-none`}></div>
    </div>
  );
};

export default ContestListItem;
