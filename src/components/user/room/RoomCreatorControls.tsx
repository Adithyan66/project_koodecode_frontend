
import React, { useState } from 'react';
import { X, Users, Settings, UserX, Code, Edit3, Crown, Mail } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { roomService } from '../../../services/axios/user/room';
import { roomSocketService } from '../../../services/roomSocketService';
import { imageKitService } from '../../../services/ImageKitService';
import type { Room } from '../../../types/room';

interface RoomCreatorControlsProps {
  room: Room;
  onClose: () => void;
}

const RoomCreatorControls: React.FC<RoomCreatorControlsProps> = ({ room: roomProp, onClose }) => {
  const user = useAppSelector(state => state.user.user);
  const roomFromRedux = useAppSelector(state => state.room.currentRoom);
  const room = roomFromRedux || roomProp;
  const [activeSection, setActiveSection] = useState<'participants' | 'settings'>('participants');
  const [isUpdatingPermissions, setIsUpdatingPermissions] = useState<Record<string, boolean>>({});

  const handlePermissionToggle = async (userId: string, permission: 'canEditCode' | 'canDrawWhiteboard' | 'canChangeProblem', value: boolean) => {
    setIsUpdatingPermissions(prev => ({ ...prev, [userId]: true }));
    try {
      const participant = room.participants.find(p => p.userId === userId);
      if (!participant) return;

      const updatedPermissions = {
        ...(participant.permissions || {}),
        [permission]: value
      };

      // await roomService.updatePermissions(room.roomId, {
      //   userId,
      //   permissions: updatedPermissions
      // });

      roomSocketService.updatePermissions(userId, updatedPermissions);
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert('Failed to update permissions. Please try again.');
    } finally {
      setIsUpdatingPermissions(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleKickUser = async (userId: string, username: string) => {
    if (userId === user?.id) {
      alert('You cannot kick yourself from the room.');
      return;
    }

    if (confirm(`Are you sure you want to kick ${username} from the room?`)) {
      try {
        await roomService.kickUser(room.roomId, userId, 'Kicked by room creator');
        // The socket will handle the UI update
      } catch (error) {
        console.error('Failed to kick user:', error);
        alert('Failed to kick user. Please try again.');
      }
    }
  };

  const renderParticipants = () => {
    const profileImageUrl = (participant: typeof room.participants[0]) => {
      if (!participant?.profilePicKey) return null;
      return imageKitService.getProfileImageUrl(participant.profilePicKey, 60, 60, {
        radius: 'max',
        crop: 'force',
        quality: 90
      });
    };

    const getInitials = (fullName: string) => {
      if (!fullName || typeof fullName !== 'string') return '??';
      const parts = fullName.trim().split(' ').filter(part => part.length > 0);
      if (parts.length === 0) return '??';
      return parts
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    if (!room.participants || room.participants.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-50" />
          <p>No participants yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center">
            <Users size={18} className="mr-2" />
            Participants
          </h3>
          <span className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full">
            {room.participants.length}
          </span>
        </div>

        {room.participants.map(participant => {
          if (!participant) return null;
          
          const imageUrl = profileImageUrl(participant);
          const isLoading = isUpdatingPermissions[participant.userId];
          const isCreator = participant.userId === room.createdBy;
          const isCurrentUser = participant.userId === user?.id;

          return (
            <div key={participant.userId} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={participant.username || 'User'}
                      className="w-14 h-14 rounded-full border-2 border-gray-600 object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{getInitials(participant.fullName || participant.username || '')}</span>
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-900 ${
                    participant.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  {isCreator && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-purple-700 p-1 rounded-full border-2 border-gray-900">
                      <Crown size={12} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-semibold truncate">{participant.fullName || participant.username || 'Unknown User'}</h4>
                      {isCurrentUser && (
                        <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">You</span>
                      )}
                    </div>
                    {!isCreator && !isCurrentUser && (
                      <button
                        onClick={() => handleKickUser(participant.userId, participant.username || 'User')}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded-lg transition-all"
                        title="Kick User"
                      >
                        <UserX size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-2 text-sm">
                    <span className="text-gray-300 truncate">@{participant.username || 'unknown'}</span>
                    {participant.email && (
                      <div className="flex items-center text-gray-400">
                        <Mail size={12} className="mr-1" />
                        <span className="truncate max-w-[120px]">{participant.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handlePermissionToggle(participant.userId, 'canEditCode', !participant.permissions?.canEditCode)}
                        disabled={isLoading || isCreator}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                          participant.permissions?.canEditCode
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30'
                            : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-650'
                        } ${isCreator ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Code size={14} />
                        <span>Code</span>
                      </button>

                      <button
                        onClick={() => handlePermissionToggle(participant.userId, 'canDrawWhiteboard', !participant.permissions?.canDrawWhiteboard)}
                        disabled={isLoading || isCreator}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                          participant.permissions?.canDrawWhiteboard
                            ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30'
                            : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-650'
                        } ${isCreator ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Edit3 size={14} />
                        <span>Draw</span>
                      </button>

                      <button
                        onClick={() => handlePermissionToggle(participant.userId, 'canChangeProblem', !participant.permissions?.canChangeProblem)}
                        disabled={isLoading || isCreator}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                          participant.permissions?.canChangeProblem
                            ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30'
                            : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-650'
                        } ${isCreator ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <Settings size={14} />
                        <span>Problem</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                    <span>Joined {participant.joinedAt ? new Date(participant.joinedAt).toLocaleDateString() : 'Unknown'}</span>
                    {isLoading && (
                      <span className="text-blue-400 flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400 mr-1"></div>
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center">
          <Settings size={18} className="mr-2" />
          Room Settings
        </h3>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-3">Room Information</label>
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400 font-medium">Name:</span>
              <span className="text-white text-right max-w-[60%]">{room.name}</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400 font-medium">Description:</span>
              <span className="text-white text-right max-w-[60%]">{room.description}</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400 font-medium">Room ID:</span>
              <span className="text-white font-mono text-xs text-right max-w-[60%] break-all">{room.roomId}</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400 font-medium">Created:</span>
              <span className="text-white text-right max-w-[60%]">{new Date(room.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="text-gray-400 font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                room.status === 'active' ? 'bg-green-600/20 text-green-400 border border-green-600/30' :
                room.status === 'waiting' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30' : 
                'bg-gray-600/20 text-gray-400 border border-gray-600/30'
              }`}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <label className="block text-white text-sm font-medium mb-3">Quick Actions</label>
          <div className="space-y-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/room/${room.roomId}`);
                alert('Room link copied to clipboard!');
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20"
            >
              <span>Copy Room Link</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to end this room? All participants will be disconnected.')) {
                  alert('End room functionality to be implemented');
                }
              }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20"
            >
              <span>End Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          aspectRatio: '3 / 5',
          minHeight: '420px'
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Creator Controls</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex space-x-2 mb-4">
            {[
              { id: 'participants', label: 'Participants', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all border ${activeSection === id
                    ? 'bg-green-600 text-white border-green-500'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="max-h-[60vh] overflow-y-auto tiny-scrollbar pr-1">
            {activeSection === 'participants' && renderParticipants()}
            {activeSection === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCreatorControls;
