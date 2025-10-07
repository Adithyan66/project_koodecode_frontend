

import { createAsyncThunk } from '@reduxjs/toolkit';
import { roomService } from '../../services/axios/user/room';
import type { CreateRoomRequest, JoinRoomRequest } from '../../types/room';


interface ProblemSummary {
  problemNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface FetchProblemsResponse {
  problems: ProblemSummary[];
  hasMore: boolean;
  total: number;
}


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




export const fetchProblemsThunk = createAsyncThunk(
  'room/fetchProblems',
  async (params: {
    page?: number;
    limit?: number;
    search?: string
  } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, search = '' } = params;
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await roomService.getProblemNames(searchParams)

      if (!response.success) {
        const errorData =  response
        return rejectWithValue(errorData.message || 'Failed to fetch problems');
      }

      const { data } = response
      
      return {
        problems: data.problems || [],
        hasMore: data.hasMore || false,
        total: data.total || 0,
        page,
        search
      } as FetchProblemsResponse & { page: number; search: string };

    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }
);
