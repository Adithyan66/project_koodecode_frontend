import type { UserDetails } from "../../../features/auth/userSlice";
import httpClient from "../httpClient";

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



export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        let res = await httpClient.post('/auth/login', credentials)
        return res
    },

    signup: async (credentials: any) => {
        let res = await httpClient.post('/auth/signup/verify-otp', credentials)
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

    requestPasswordReset: (email: string) => httpClient.post(`auth/forgot/request-otp`, { email })

    ,
    
    resetPassword: (email: string, otp: number, password: string) => httpClient.post(`auth/forgot/change-password`, { email, otp, password })

};
