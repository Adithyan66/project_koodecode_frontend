

import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenManager } from '../../utils/tokenManager';
import type { UserDetails } from './userSlice';
import httpClient from '../../services/axios/httpClient';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/axios/auth/authService';



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


export const signupUser = createAsyncThunk(
    'user/signup',
    async (credentials: any, { dispatch, rejectWithValue }) => {

        try {
            const response = await authAPI.signup(credentials);

            const { token, ...user } = response.data.user;

            tokenManager.setToken(token);

            return user as UserDetails

        } catch (error: any) {
            // return rejectWithValue(error.response?.data?.message || "signup failed")

            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'Network error occurred' });
        }
    }
)


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
    async (_, { }) => {
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


export const forgotPassword = createAsyncThunk(
    'user/forgot-password',
    async (data: any, { dispatch, rejectWithValue }) => {

        try {
            console.log("ivte varatteee,", data.email, data.otp, data.password);

            let response = await authAPI.resetPassword(data.email, data.otp, data.password)

            console.log(response.data.user);

            const { token, ...user } = response.data.user;  

            tokenManager.setToken(token);

            return user as UserDetails;  

        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'Network error occurred' });
        }
    }
)



export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { }) => {

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


