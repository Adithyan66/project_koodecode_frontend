

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Eye } from 'lucide-react';
import { Contest } from '../../types/contest';
import { imageKitService } from '../../services/ImageKitService';

const getContestThumbnail = (thumbnailKey: string) => {
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

const ContestListItem = ({ contest, isPast, onRegister }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/contest/${contest.contestNumber}`)}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
    >
      <div className="flex space-x-4">
        <img
          src={getContestThumbnail(contest.thumbnail)}
          alt={contest.title}
          className="w-24 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{contest.title}</h3>
            {isPast ? (
              <button
                onClick={() => navigate(`/contests/${contest.id}/results`)}
                className="flex items-center text-green-400 hover:text-green-300 transition-colors"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Results
              </button>
            ) : (
              <div className="text-right">
                <div className="text-green-400 font-medium">{contest.maxReward} coins</div>
                <div className="text-gray-400 text-sm">Max reward</div>
              </div>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{contest.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatTime(contest.startTime.toString())}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {contest.totalParticipants} registered
              </div>
            </div>
            {!isPast && (
              contest.isRegistered ? (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Registered
                </span>
              ) : contest.canRegister ? (
                <button
                  onClick={() => onRegister(contest.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </button>
              ) : (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  Registration Closed
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestListItem;