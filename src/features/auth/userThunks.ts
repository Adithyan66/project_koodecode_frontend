

import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenManager } from '../../utils/tokenManager';
import type { UserDetails } from './userSlice';
import httpClient from '../../services/axios/httpClient';



interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: UserDetails;
}

interface LoginError {
  message: string;
}

export const loginUser = createAsyncThunk<
    UserDetails,              
    LoginCredentials,  
    { rejectValue: LoginError }  
>(
    'user/login',
    async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {

        try {

            const response = await authAPI.login(credentials);

            const { token, ...user } = response.data.user;

            tokenManager.setToken(token);

            return user as UserDetails

        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Fetch user profile using stored token
export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = tokenManager.getToken();

            if (!token) {

                return rejectWithValue('No authentication token found');
            }

            const response = await authAPI.getProfile(token);

            return response.data;

        } catch (error: any) {

            if (error.response?.status === 401) {
                tokenManager.removeToken();
            }
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const initializeAuth = createAsyncThunk(
    'user/initializeAuth',
    async (_, {  }) => {
    // async (_, { dispatch, rejectWithValue }) => {

        try {
            const token = tokenManager.getToken();

            if (!token) {
                return { isAuthenticated: false, user: null };
            }

            const response = await authAPI.validateTokenAndGetUser(token);

            console.log("res of val token", response);

            return {
                isAuthenticated: true,
                user: response.data.user 
            };

        } catch (error: any) {

            tokenManager.removeToken();

            return { isAuthenticated: false, user: null };
        }
    }
);



export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, {  }) => {

        try {

            const token = tokenManager.getToken();

            if (token) {
                await authAPI.logout(token);
            }

            tokenManager.removeToken();
            return null;

        } catch (error) {

            tokenManager.removeToken();
            return null;
        }
    }
);

export const refreshUserProfile = createAsyncThunk(
    'user/refreshProfile',
    async (_, { dispatch }) => {
        return dispatch(fetchUserProfile());
    }
);



export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        let res = await httpClient.post('/auth/login', credentials)
        console.log("res of login", res);
        return res
    },

    getProfile: (token?: string) =>

        httpClient.get('/auth/profile'),

    validateTokenAndGetUser: (token: string) =>

        httpClient.get('/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
        })
    ,

    logout: (token: string) =>

        httpClient.post('/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        }),
};

