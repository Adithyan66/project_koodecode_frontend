import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Room, RoomListItem } from '../../types/room';
import { createRoomThunk, joinRoomThunk, getPublicRoomsThunk, fetchProblemsThunk } from './roomThunks';


interface ProblemSummary {
  problemNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}


interface RoomState {
  currentRoom: Room | null;
  publicRooms: RoomListItem[];
  isLoading: boolean;
  isJoining: boolean;
  error: string | null;
  socketConnected: boolean;

  problems: ProblemSummary[];
  problemsLoading: boolean;
  problemsError: string | null;
  problemsHasMore: boolean;
  problemsTotal: number;
  currentProblemPage: number;
  currentSearchQuery: string;
}

const initialState: RoomState = {
  currentRoom: null,
  publicRooms: [],
  isLoading: false,
  isJoining: false,
  error: null,
  socketConnected: false,

  problems: [],
  problemsLoading: false,
  problemsError: null,
  problemsHasMore: true,
  problemsTotal: 0,
  currentProblemPage: 1,
  currentSearchQuery: ''
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

    updateUserPermissions: (state, action: PayloadAction<{ userId: string; permissions: any; targetUserId?: string }>) => {
      if (state.currentRoom) {
        const participant = state.currentRoom.participants.find(p => p.userId === action.payload.userId);
        if (participant) {
          participant.permissions = action.payload.permissions;
        }
        
        if (action.payload.targetUserId && action.payload.targetUserId === action.payload.userId) {
          state.currentRoom.userPermissions = action.payload.permissions;
        }
      }
    },

    addParticipant: (state, action: PayloadAction<{
      userId: string;
      username: string;
      fullName: string;
      email: string;
      profilePicKey: string,
    }>) => {
      if (state.currentRoom) {
        const exists = state.currentRoom.participants.some(p => p.userId === action.payload.userId);
        if (!exists) {
          state.currentRoom.participants.push({
            userId: action.payload.userId,
            username: action.payload.username,
            fullName: action.payload.fullName,
            email: action.payload.email,
            profilePicKey: action.payload.profilePicKey,
            joinedAt: new Date().toISOString(),
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
    },

    clearProblemsError: (state) => {
      state.problemsError = null;
    },

    resetProblems: (state) => {
      state.problems = [];
      state.currentProblemPage = 1;
      state.problemsHasMore = true;
      state.problemsError = null;
    },

    setProblemsSearchQuery: (state, action: PayloadAction<string>) => {
      state.currentSearchQuery = action.payload;
      // Reset problems when search query changes
      if (action.payload !== state.currentSearchQuery) {
        state.problems = [];
        state.currentProblemPage = 1;
        state.problemsHasMore = true;
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


    builder
      .addCase(fetchProblemsThunk.pending, (state, action) => {
        state.problemsLoading = true;
        state.problemsError = null;

        // Reset problems list if it's a new search or first page
        if (action.meta.arg?.page === 1 || action.meta.arg?.search !== state.currentSearchQuery) {
          state.problems = [];
          state.currentProblemPage = 1;
        }
      })
      .addCase(fetchProblemsThunk.fulfilled, (state, action) => {
        state.problemsLoading = false;

        const { problems, hasMore, total, page, search } = action.payload;

        // If it's a new search, replace the problems list
        if (page === 1 || search !== state.currentSearchQuery) {
          state.problems = problems;
        } else {
          // Otherwise, append to existing problems
          state.problems = [...state.problems, ...problems];
        }

        state.problemsHasMore = hasMore;
        state.problemsTotal = total;
        state.currentProblemPage = page;
        state.currentSearchQuery = search;
      })
      .addCase(fetchProblemsThunk.rejected, (state, action) => {
        state.problemsLoading = false;
        state.problemsError = action.payload as string;
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
  removeParticipant,
  clearProblemsError,
  resetProblems,
  setProblemsSearchQuery
} = roomSlice.actions;

export default roomSlice.reducer;
