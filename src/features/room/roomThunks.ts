

import { createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '../../services/axios/user/room';
import type { CreateRoomRequest, JoinRoomRequest } from '../../types/room';

export const createRoomThunk = createAsyncThunk(
  'room/create',
  async (data: CreateRoomRequest, { rejectWithValue }) => {
    try {
      const result = await roomService.createRoom(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create room');
    }
  }
);

export const joinRoomThunk = createAsyncThunk(
  'room/join',
  async (data: JoinRoomRequest, { rejectWithValue }) => {
    try {
      const result = await roomService.joinRoom(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to join room');
    }
  }
);

export const getPublicRoomsThunk = createAsyncThunk(
  'room/getPublicRooms',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const result = await roomService.getPublicRooms(limit);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch rooms');
    }
  }
);
