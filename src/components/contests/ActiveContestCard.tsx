

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy } from 'lucide-react';
import { Contest } from '../../types/contest'; 
import { imageKitService } from '../../services/ImageKitService'; 

const getContestThumbnail = (thumbnailKey) => {
  if (thumbnailKey) {
    return imageKitService.getProfileImageUrl(thumbnailKey, 400, 200, { radius: '8' });
  }
  return '/default-contest-thumbnail.jpg';
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ActiveContestCard = ({ contest, timeLeft }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/contest/${contest.contestNumber}`)}
      className="bg-gray-900 border hover:cursor-pointer border-gray-800 rounded-lg overflow-hidden w-full max-w-md"
    >
      <div className="relative">
        <img
          src={getContestThumbnail(contest.thumbnail)}
          alt={contest.title}
          className="w-full h-68 object-cover"
        />
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          LIVE
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{contest.title}</h3>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-green-400">{formatTime(contest.timeRemaining)}</div>
            <p className="text-gray-400 text-sm">Time Remaining</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-400">
            <Users className="h-4 w-4 mr-2" />
            <span>{contest.totalParticipants} participants</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Trophy className="h-4 w-4 mr-2" />
            <span>{contest.maxReward} coins prize</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveContestCard;