
import React, { useState } from 'react';
import { X, Users, Settings, UserX, Shield, Code, Edit3 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { roomService } from '../../../services/axios/user/room';
import { roomSocketService } from '../../../services/roomSocketService';
import type { Room } from '../../../types/room';

interface RoomCreatorControlsProps {
  room: Room;
  onClose: () => void;
}

const RoomCreatorControls: React.FC<RoomCreatorControlsProps> = ({ room, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeSection, setActiveSection] = useState<'participants' | 'permissions' | 'settings'>('participants');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isUpdatingPermissions, setIsUpdatingPermissions] = useState(false);

  const handlePermissionToggle = async (userId: string, permission: 'canEditCode' | 'canDrawWhiteboard' | 'canChangeProblem', value: boolean) => {
    setIsUpdatingPermissions(true);
    try {
      const participant = room.participants.find(p => p.userId === userId);
      if (!participant) return;

      const updatedPermissions = {
        ...participant.permissions,
        [permission]: value
      };

      await roomService.updatePermissions(room.roomId, {
        userId,
        permissions: updatedPermissions
      });

      // The socket will handle the UI update via the permissions-updated event
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert('Failed to update permissions. Please try again.');
    } finally {
      setIsUpdatingPermissions(false);
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

  const renderParticipants = () => (
    <div className="space-y-3">
      <h3 className="text-white font-medium flex items-center">
        <Users size={16} className="mr-2" />
        Participants ({room.participants.length})
      </h3>

      {room.participants.map(participant => (
        <div key={participant.userId} className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white font-medium">{participant.username}</span>
              {participant.userId === room.createdBy && (
                <span className="bg-purple-600 text-xs px-2 py-1 rounded">Creator</span>
              )}
              {participant.userId === user?.id && (
                <span className="bg-blue-600 text-xs px-2 py-1 rounded">You</span>
              )}
            </div>

            {participant.userId !== user?.id && (
              <button
                onClick={() => handleKickUser(participant.userId, participant.username)}
                className="text-red-400 hover:text-red-300 p-1 transition-colors"
                title="Kick User"
              >
                <UserX size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Code size={12} />
              <span className={participant.permissions.canEditCode ? 'text-green-400' : 'text-gray-400'}>
                Code
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Edit3 size={12} />
              <span className={participant.permissions.canDrawWhiteboard ? 'text-green-400' : 'text-gray-400'}>
                Whiteboard
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Settings size={12} />
              <span className={participant.permissions.canChangeProblem ? 'text-green-400' : 'text-gray-400'}>
                Problem
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-2">
            Joined: {new Date(participant.joinedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPermissions = () => (
    <div className="space-y-4">
      <h3 className="text-white font-medium flex items-center">
        <Shield size={16} className="mr-2" />
        Manage Permissions
      </h3>

      <div className="mb-4">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a participant...</option>
          {room.participants.filter(p => p.userId !== user?.id).map(participant => (
            <option key={participant.userId} value={participant.userId}>
              {participant.username}
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
          {(() => {
            const participant = room.participants.find(p => p.userId === selectedUserId);
            if (!participant) return null;

            return (
              <>
                <h4 className="text-white font-medium">{participant.username}'s Permissions</h4>

                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Code size={16} className="text-blue-400" />
                      <span className="text-white">Can Edit Code</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={participant.permissions.canEditCode}
                      onChange={(e) => handlePermissionToggle(selectedUserId, 'canEditCode', e.target.checked)}
                      disabled={isUpdatingPermissions}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Edit3 size={16} className="text-green-400" />
                      <span className="text-white">Can Draw on Whiteboard</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={participant.permissions.canDrawWhiteboard}
                      onChange={(e) => handlePermissionToggle(selectedUserId, 'canDrawWhiteboard', e.target.checked)}
                      disabled={isUpdatingPermissions}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Settings size={16} className="text-purple-400" />
                      <span className="text-white">Can Change Problem</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={participant.permissions.canChangeProblem}
                      onChange={(e) => handlePermissionToggle(selectedUserId, 'canChangeProblem', e.target.checked)}
                      disabled={isUpdatingPermissions}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <h3 className="text-white font-medium flex items-center">
        <Settings size={16} className="mr-2" />
        Room Settings
      </h3>

      <div className="bg-gray-700 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">Room Information</label>
          <div className="space-y-2 text-sm text-gray-300">
            <div><strong>Name:</strong> {room.name}</div>
            <div><strong>Description:</strong> {room.description}</div>
            <div><strong>Room ID:</strong> {room.roomId}</div>
            <div><strong>Created:</strong> {new Date(room.createdAt).toLocaleString()}</div>
            <div><strong>Status:</strong>
              <span className={`ml-1 px-2 py-1 rounded text-xs ${room.status === 'active' ? 'bg-green-600' :
                  room.status === 'waiting' ? 'bg-yellow-600' : 'bg-gray-600'
                }`}>
                {room.status}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <label className="block text-white text-sm font-medium mb-2">Quick Actions</label>
          <div className="space-y-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/room/${room.roomId}`);
                alert('Room link copied to clipboard!');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Copy Room Link
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to end this room? All participants will be disconnected.')) {
                  // TODO: Implement end room functionality
                  alert('End room functionality to be implemented');
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              End Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold">Creator Controls</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-1 mb-4">
        {[
          { id: 'participants', label: 'Participants', icon: Users },
          { id: 'permissions', label: 'Permissions', icon: Shield },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id as any)}
            className={`flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors ${activeSection === id
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="max-h-64 overflow-y-auto no-scrollbar">
        {activeSection === 'participants' && renderParticipants()}
        {activeSection === 'permissions' && renderPermissions()}
        {activeSection === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default RoomCreatorControls;
