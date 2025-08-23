import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { UserDetails } from './userSlice';

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    user: UserDetails;
}

export const loginUser = createAsyncThunk<

    LoginResponse,
    LoginPayload,
    {
        rejectValue: string;
    }
>('user/login', async (payload, { rejectWithValue }) => {

    try {

        const response = await axios.post('http://localhost:3000/api/auth/login', payload);

        return { user: response.data.user };

    } catch (error) {

        if (axios.isAxiosError(error) && error.response?.data?.message) {

            return rejectWithValue(error.response.data.message);
        }

        return rejectWithValue('Login failed');
    }
});
