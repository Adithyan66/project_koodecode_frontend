import httpClient from "../httpClient";

interface LoginCredentials {
    email: string;
    password: string;
}




export const authAPI = {

    login: async (credentials: LoginCredentials) => {
        let res = await httpClient.post('/auth/login', credentials)
        return res.data
    }
    ,
    signUpOtp: async (email: string, userName: string, fullName: string) =>
        await httpClient.post("/auth/signup/request-otp", { email, userName, fullName })
    ,
    signup: async (credentials: any) => {
        let res = await httpClient.post('/auth/signup/verify-otp', credentials)
        return res.data
    }
    ,
    googleOAuth: async (credentials: { token: string }) => {
        let response = await httpClient.post('/auth/google/callback', credentials)
        return response.data
    }
    ,
    githubOAuth: async (credentials: { code: string }) => {
        let response = await httpClient.post('/auth/github/callback', credentials)
        return response.data
    }
    ,
    getProfile: (token: string) =>
        httpClient.get('/auth/profile')
    ,
    validateTokenAndGetUser: async (token: string) => {
        let response = await httpClient.get('/auth/validate', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return response.data.data
    }
    ,
    logout: (token: string) =>

        httpClient.post('/auth/logout', {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
    ,
    requestPasswordReset: (email: string) => httpClient.post(`auth/forgot/request-otp`, { email })
    ,
    resetPassword: async (email: string, otp: number, password: string) => {
        let response = await httpClient.post(`auth/forgot/change-password`, { email, otp, password })
        return response.data
    }
    ,
    verifyOtp: async (email: string, otp: number) => {
        let response = await httpClient.post('auth/verify-otp', { email, otp })
        return response.data
    }
    ,
    changePassword: async (password: string, newPassword: string) => {
        let response = await httpClient.patch('/auth/change-password', { password, newPassword })
        return response.data
    }


};
