import React, { useState } from 'react';
import { Users, Calendar } from 'lucide-react';
import type { PublicRoom } from '../../../types/room';
import { imageKitService } from '../../../services/ImageKitService';
import RoomDetailsModal from './RoomDetailsModal';

interface RoomCardProps {
  room: PublicRoom;
  onJoinRoom: (roomId: string) => void;
  isJoining?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoinRoom, isJoining = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getThumbnailUrl = (thumbnail?: string): string => {
    if (!thumbnail) return '';
    if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
      return thumbnail;
    }
    return imageKitService.getRoomThumbnailUrl(thumbnail);
  };

  const thumbnailUrl = getThumbnailUrl(room.thumbnail);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleJoinRoomWrapper = (roomId: string) => {
    onJoinRoom(roomId);
  };

  return (
    <>
      <div
        className="cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleCardClick}
      >
        <div className="relative w-full aspect-video mb-3 rounded-lg overflow-hidden bg-white-100">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={room.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
              <div className="text-center">
                <Calendar size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No Thumbnail</p>
              </div>
            </div>
          )}

          {room.status === 'active' && (
            <div className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span className="text-white text-xs font-semibold">LIVE</span>
            </div>
          )}

          {room.status === 'waiting' && room.scheduledTime && (
            <div className="absolute top-2 right-2 bg-blue-500 px-2 py-1 rounded-full flex items-center space-x-1">
              <Calendar size={10} className="text-white" />
              <span className="text-white text-xs font-semibold">
                {formatScheduledTime(room.scheduledTime)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <img
            src={room.createdBy.profilePicUrl || "/default-avatar.png"}
            alt={room.createdBy.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1 line-clamp-2" title={room.name}>
              {room.name}
            </h3>
            <p className="text-gray-400 text-sm mb-1">
              {room.createdBy.fullName || `@${room.createdBy.userName}`}
            </p>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span className="flex items-center space-x-1">
                <Users size={14} />
                <span>{room.participantCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <RoomDetailsModal
        isOpen={isModalOpen}
        room={room}
        onClose={() => setIsModalOpen(false)}
        onJoinRoom={handleJoinRoomWrapper}
        isJoining={isJoining}
      />
    </>
  );
};

export default RoomCard;
