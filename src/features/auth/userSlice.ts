import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from './userThunks';

export type UserRole = 'admin' | 'user'

export interface UserDetails {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

interface UserState {
    user: UserDetails | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
};


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserDetails>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            state.status = 'succeeded';
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.status = 'idle';
        },
        updateUser: (state, action: PayloadAction<Partial<UserDetails>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed';
            });
    },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;

