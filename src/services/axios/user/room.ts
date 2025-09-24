
import httpClient from '../httpClient';
import type { Room, RoomListItem, CreateRoomRequest, JoinRoomRequest, UpdatePermissionsRequest } from '../../../types/room';

export const roomService = {
  async createRoom(data: CreateRoomRequest): Promise<{ success: boolean; room?: Room; error?: string }> {
    try {
      const response = await httpClient.post('/rooms', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create room'
      };
    }
  },

  async joinRoom(data: JoinRoomRequest): Promise<{ success: boolean; room?: Room; error?: string }> {
    try {
      const response = await httpClient.post(`/user/rooms/${data.roomId}/join`, { password: data.password });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to join room'
      };
    }
  },

  async getPublicRooms(limit = 20): Promise<{ success: boolean; rooms: RoomListItem[]; total: number }> {
    try {
      const response = await httpClient.get(`/rooms/public?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      return { success: false, rooms: [], total: 0 };
    }
  },

  async updatePermissions(roomId: string, data: UpdatePermissionsRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await httpClient.put(`/rooms/${roomId}/permissions`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update permissions'
      };
    }
  },

  async kickUser(roomId: string, userId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await httpClient.delete(`/rooms/${roomId}/participants/${userId}`, {
        data: { reason }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to kick user'
      };
    }
  }
};
