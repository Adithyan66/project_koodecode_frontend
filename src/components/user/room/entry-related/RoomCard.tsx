

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
//   const getImageKitUrl = (imageUrl?: string, width: number = 300, height: number = 200) => {
//     if (!imageUrl) return null;
    
//     // If it's already an ImageKit URL, return as is
//     if (imageUrl.includes('imagekit.io')) {
//       return imageUrl;
//     }
    
//     // Convert S3 URL to ImageKit URL with transformations
//     // const imageKitBaseUrl = process.env.REACT_APP_IMAGEKIT_URL; // e.g., "https://ik.imagekit.io/your-imagekit-id"
//     return `${imageKitBaseUrl}/tr:w-${width},h-${height},c-fill,q-80/${imageUrl}`;
//   };

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

  const getCreatorAvatar = () => {
    if (room.createdBy.avatar) {
      return imageKitService.getOptimizedImageUrl(room.createdBy.avatar);
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group">
      <div className="relative">
        {getThumbnailImage() ? (
          <img
            src={getThumbnailImage()!}
            alt={room.name}
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
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onJoinRoom(room.roomId)}
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
        </div>
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
            {getCreatorAvatar() ? (
              <img
                src={getCreatorAvatar()!}
                alt={room.createdBy.username}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-semibold">
                  {/* {room.createdBy.username.charAt(0).toUpperCase()} */}
                  hihih
                </span>
              </div>
            )}
            <span className="text-gray-400 text-sm">{room.createdBy.username}</span>
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
