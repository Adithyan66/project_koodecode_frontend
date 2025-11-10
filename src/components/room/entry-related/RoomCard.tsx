import React, { useState } from 'react';
import { Users, Calendar, Play, Bell } from 'lucide-react';
import type { PublicRoom } from '../../../types/room';
import { imageKitService } from '../../../services/ImageKitService';
import { toast } from 'react-toastify';

interface RoomCardProps {
  room: PublicRoom;
  onJoinRoom: (roomId: string) => void;
  isJoining?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoinRoom, isJoining = false }) => {
  const [isSubscribing, setIsSubscribing] = useState(false);

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

  const handleJoinRoomWrapper = (roomId: string) => {
    onJoinRoom(roomId);
  };

  const handleGetNotified = async () => {
    if (isSubscribing) return;
    setIsSubscribing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('You will be notified when this room goes live!');
    } catch (error) {
      toast.error('Failed to subscribe for notifications');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <div className="group transition-opacity hover:opacity-90">
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

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10 px-4 text-center">
            {room.status === 'active' ? (
              <button
                type="button"
                onClick={() => handleJoinRoomWrapper(room.id)}
                disabled={isJoining}
                className="flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <span className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg">
                    <Play size={22} className="text-black" />
                  </span>
                )}
                <span className="text-white text-xs font-semibold uppercase tracking-wide">
                  {isJoining ? 'Joining...' : 'Join Room'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGetNotified}
                disabled={isSubscribing}
                className="flex flex-col items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? (
                  <span className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <Bell size={22} className="text-white" />
                  </span>
                )}
                <span className="text-white text-xs font-semibold uppercase tracking-wide">
                  {isSubscribing ? 'Subscribing...' : 'Get Notified'}
                </span>
              </button>
            )}
            {room.status === 'waiting' && room.scheduledTime && (
              <span className="text-white text-sm font-medium">
                {formatScheduledTime(room.scheduledTime)}
              </span>
            )}
          </div>

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

    </>
  );
};

export default RoomCard;
