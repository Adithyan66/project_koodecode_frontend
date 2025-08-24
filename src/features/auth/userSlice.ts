



import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, initializeAuth, logoutUser, fetchUserProfile } from './userThunks';

export interface UserDetails {
    id: string;
    fullName: string;
    email: string;
    isAdmin: boolean;
    profilePicUrl?: string;
}

interface UserState {
    user: UserDetails | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isInitialized: boolean;
    profileLoading: boolean; // Separate loading state for profile fetches
}

const initialState: UserState = {
    user: null,
    isAdmin: false,
    isAuthenticated: false,
    status: 'idle',
    error: null,
    isInitialized: false,
    profileLoading: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserDetails>) => {
            state.user = action.payload;
            state.isAdmin = action.payload.isAdmin;
            state.isAuthenticated = true;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.error = null;
            state.status = 'idle';
        },
        updateUser: (state, action: PayloadAction<Partial<UserDetails>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setInitialized: (state) => {
            state.isInitialized = true;
        },
    },

    extraReducers: (builder) => {
        builder


            // Login cases - only handle token, fetch user data separately
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isAdmin = action.payload.isAdmin;
                state.profileLoading = false;
                state.error = null;

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Login failed';
            })



            // Initialize auth cases
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                if (action.payload.user) {
                    state.user = action.payload.user;
                    state.isAdmin = action.payload.user.isAdmin;
                }
                state.isInitialized = true;
                state.status = 'idle';
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.isInitialized = true;
                state.status = 'idle';
            })

            // Fetch user profile cases
            // .addCase(fetchUserProfile.pending, (state) => {
            //     state.profileLoading = true;
            // })
            // .addCase(fetchUserProfile.fulfilled, (state, action) => {
            //     state.user = action.payload;
            //     state.isAdmin = action.payload.isAdmin;
            //     state.profileLoading = false;
            //     state.error = null;
            // })
            // .addCase(fetchUserProfile.rejected, (state, action) => {
            //     state.profileLoading = false;
            //     state.error = action.payload.message || 'Failed to fetch user profile';
            // })

            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isAdmin = false;
                state.error = null;
                state.status = 'idle';
            });
    },
});

export const { setUser, clearUser, updateUser, setInitialized } = userSlice.actions;
export default userSlice.reducer;
