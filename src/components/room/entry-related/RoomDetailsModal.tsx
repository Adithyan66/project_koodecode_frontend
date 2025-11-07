import React, { useState } from 'react';
import { X, Play, Bell, Users, Calendar, Clock } from 'lucide-react';
import type { PublicRoom } from '../../../types/room';
import { imageKitService } from '../../../services/ImageKitService';
import { toast } from 'react-toastify';

interface RoomDetailsModalProps {
  isOpen: boolean;
  room: PublicRoom | null;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
  isJoining?: boolean;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  isOpen,
  room,
  onClose,
  onJoinRoom,
  isJoining = false
}) => {
  const [isSubscribing, setIsSubscribing] = useState(false);

  if (!isOpen || !room) return null;

  const formatScheduledTime = (scheduledTime?: string) => {
    if (!scheduledTime) return '';
    const date = new Date(scheduledTime);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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

  const handleGetNotified = async () => {
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

  const thumbnailUrl = getThumbnailUrl(room.thumbnail);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isJoining && !isSubscribing) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Room Details</h2>
            <button
              onClick={onClose}
              disabled={isJoining || isSubscribing}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {thumbnailUrl ? (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              <img
                src={thumbnailUrl}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {room.status === 'active' && (
                <div className="absolute top-4 right-4 bg-red-500 px-3 py-1 rounded-full flex items-center space-x-1 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white text-sm font-semibold">LIVE</span>
                </div>
              )}
              {room.status === 'waiting' && room.scheduledTime && (
                <div className="absolute top-4 right-4 bg-blue-500 px-3 py-1 rounded-full flex items-center space-x-1">
                  <Calendar size={12} className="text-white" />
                  <span className="text-white text-xs font-semibold">
                    {formatScheduledTime(room.scheduledTime)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 mb-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play size={48} className="text-green-400 mx-auto mb-2" />
                <p className="text-gray-400">No Thumbnail</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{room.name}</h3>
              <p className="text-gray-400">{room.description}</p>
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
              <img
                src={room.createdBy.profilePicUrl || "/default-avatar.png"}
                alt={room.createdBy.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">{room.createdBy.fullName}</p>
                <p className="text-gray-400 text-sm">@{room.createdBy.userName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users size={20} />
                <span>{room.participantCount} participants</span>
              </div>
              {room.status === 'waiting' && room.scheduledTime && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock size={20} />
                  <span>{formatScheduledTime(room.scheduledTime)}</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-700">
              {room.status === 'active' ? (
                <button
                  onClick={() => onJoinRoom(room.id)}
                  disabled={isJoining}
                  className="w-full bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      <span>Join Room</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGetNotified}
                  disabled={isSubscribing}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Bell size={20} />
                      <span>Get Notified</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;

