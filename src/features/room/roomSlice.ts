import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Room, RoomListItem } from '../../types/room';
import { createRoomThunk, joinRoomThunk, getPublicRoomsThunk } from './roomThunks';

interface RoomState {
  currentRoom: Room | null;
  publicRooms: RoomListItem[];
  isLoading: boolean;
  isJoining: boolean;
  error: string | null;
  socketConnected: boolean;
}

const initialState: RoomState = {
  currentRoom: null,
  publicRooms: [],
  isLoading: false,
  isJoining: false,
  error: null,
  socketConnected: false
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    leaveRoom: (state) => {
      state.currentRoom = null;
      state.socketConnected = false;
    },

    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },

    updateRoomProblem: (state, action: PayloadAction<{ problem: any; code: string; language: string }>) => {
      if (state.currentRoom) {
        state.currentRoom.problem = action.payload.problem;
        state.currentRoom.problemNumber = action.payload.problem.number;
      }
    },

    updateUserPermissions: (state, action: PayloadAction<{ userId: string; permissions: any }>) => {
      if (state.currentRoom) {
        const participant = state.currentRoom.participants.find(p => p.userId === action.payload.userId);
        if (participant) {
          participant.permissions = action.payload.permissions;
        }
      }
    },

    addParticipant: (state, action: PayloadAction<{ userId: string; username: string }>) => {
      if (state.currentRoom) {
        const exists = state.currentRoom.participants.some(p => p.userId === action.payload.userId);
        if (!exists) {
          state.currentRoom.participants.push({
            userId: action.payload.userId,
            username: action.payload.username,
            joinedAt: new Date(),
            isOnline: true,
            permissions: { canEditCode: false, canDrawWhiteboard: false, canChangeProblem: false }
          });
        }
      }
    },

    removeParticipant: (state, action: PayloadAction<string>) => {
      if (state.currentRoom) {
        state.currentRoom.participants = state.currentRoom.participants.filter(
          p => p.userId !== action.payload
        );
      }
    }
  },

  extraReducers: (builder) => {
    // Create Room
    builder
      .addCase(createRoomThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRoomThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentRoom = action.payload.room!;
        } else {
          state.error = action.payload.error!;
        }
      })
      .addCase(createRoomThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
      // Join Room
      builder
      .addCase(joinRoomThunk.pending, (state) => {
        state.isJoining = true;
        state.error = null;
      })
      .addCase(joinRoomThunk.fulfilled, (state, action) => {
        state.isJoining = false;
        console.log("actionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn payyyyyyyyy",action.payload.room)
        if (action.payload.success) {
          state.currentRoom = action.payload.room!;
        } else {
          state.error = action.payload.error!;
        }
      })
      .addCase(joinRoomThunk.rejected, (state, action) => {
        state.isJoining = false;
        state.error = action.payload as string;
      });

    // Get Public Rooms
    builder
      .addCase(getPublicRoomsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicRoomsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicRooms = action.payload.rooms;
      })
      .addCase(getPublicRoomsThunk.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  clearError,
  leaveRoom,
  setSocketConnected,
  updateRoomProblem,
  updateUserPermissions,
  addParticipant,
  removeParticipant
} = roomSlice.actions;

export default roomSlice.reducer;
