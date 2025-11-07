
import httpClient from '../httpClient';
import type { Room, CreateRoomRequest, JoinRoomRequest, UpdatePermissionsRequest, PublicRoomsResponse, JoinRoomResponse } from '../../../types/room';



export const roomService = {


  async getPublicRooms(params: { status?: 'active' | 'waiting'; page?: number; limit?: number; search?: string; }): Promise<PublicRoomsResponse | undefined> {

    try {
      console.log("paramsssssssssssssssssssssssss");
      const response = await httpClient.get('/user/rooms/public', { params });
      return response.data;
    } catch (error: any) {
      console.log(error)

    }
  },


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

  async joinRoom(data: JoinRoomRequest): Promise<JoinRoomResponse> {
    try {
      const response = await httpClient.post(`/user/rooms/${data.roomId}/join`, { password: data.password });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to join room',
        data: {} as Room,
        error: error.response?.data?.error || 'Failed to join room'
      };
    }
  },

  async updatePermissions(roomId: string, data: UpdatePermissionsRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await httpClient.put(`/user/rooms/${roomId}/permissions`, data);
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
  },

  async getProblemNames(searchParams: any) {
    try {
      const response = await httpClient.get(`/user/problems/problem-names?${searchParams}`, {
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch problems'
      };
    }
  }



};

