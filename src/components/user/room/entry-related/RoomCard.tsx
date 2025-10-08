

// src/components/user/rooms/RoomCard.tsx
import React from 'react';
import { Users, Clock, Calendar, Play } from 'lucide-react';
import type { PublicRoom } from '../../../../types/room';
import { imageKitService } from '../../../../services/ImageKitService';

interface RoomCardProps {
  room: PublicRoom;
  onJoinRoom: (roomId: string) => void;
  isJoining?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoinRoom, isJoining = false }) => {

  const formatScheduledTime = (scheduledTime?: string) => {
    if (!scheduledTime) return '';
    const date = new Date(scheduledTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThumbnailImage = () => {
    if (room.thumbnail) {
      return imageKitService.getOptimizedImageUrl(room.thumbnail);
    }
    // Default gradient background for rooms without thumbnails
    return null;
  };


  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group">
      <div className="relative">
        {room.thumbnail ? (
          <img
            src={room.thumbnail}
            // alt={room.name}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="text-center">
              <Play size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No Thumbnail</p>
            </div>
          </div>
        )}

        {/* Live indicator for active rooms */}
        {room.status === 'active' && (
          <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full flex items-center space-x-1 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-white text-sm font-semibold">LIVE</span>
          </div>
        )}

        {/* Scheduled indicator for waiting rooms */}
        {room.status === 'waiting' && room.scheduledTime && (
          <div className="absolute top-4 left-4 bg-blue-500 px-3 py-1 rounded-full flex items-center space-x-1">
            <Calendar size={12} className="text-white" />
            <span className="text-white text-xs font-semibold">
              {formatScheduledTime(room.scheduledTime)}
            </span>
          </div>
        )}

        {/* Join button overlay on hover */}
        { room.status ==="active" &&  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onJoinRoom(room.id)}
            disabled={isJoining}
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Join Room</span>
              </>
            )}
          </button>
        </div>}
      </div>

      <div className="p-6">
        {/* Room Name */}
        <h3 className="text-xl font-bold mb-2 text-white truncate" title={room.name}>
          {room.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2" title={room.description}>
          {room.description}
        </p>

        {/* Creator and Participants Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={ room.createdBy.profilePicUrl|| "/default-avatar.png"} // fallback to default
              alt={room.createdBy.username}
              className="w-6 h-6 rounded-full object-cover"
            />

            <span className="text-gray-400 text-sm flex items-center space-x-1">
              <span className="text-gray-500">@{room.createdBy.userName}</span>
              {/* <span>{room.createdBy.fullName}</span> */}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-400">
            <Users size={16} />
            <span className="text-sm">{room.participantCount} participants</span>
          </div>
        </div>

        {/* Room Number */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-semibold inline-block">
            Room #{room.roomNumber}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
