
import axios from "axios";
import { tokenManager } from "../../utils/tokenManager";

const VITE_API_URL = import.meta.env.VITE_API_URL;


const httpClient = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
})


httpClient.interceptors.request.use(

    (config) => {
        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



httpClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            config.headers["content-type"] = "multipart/form-data";
        } else {
            config.headers["content-type"] = "application/json";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


httpClient.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/refresh-token")
        ) {
            console.log("401 detected, attempting to refresh token...");
            originalRequest._retry = true;

            try {
                const { data } = await httpClient.get("auth/refresh-token", {});

                localStorage.setItem("accessToken", data.data.accessToken);

                return httpClient(originalRequest);

            } catch (refreshError) {

                localStorage.removeItem("accessToken");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


// httpClient.interceptors.response.use(

//     response => response,

//     async error => {

//         const originalRequest = error.config;


//         if (error.response && error.response.status === 401 && !originalRequest._retry) {

//             console.log("401 detected, attempting to refresh token...");

//             originalRequest._retry = true;

//             try {

//                 const { data } = await httpClient.get('/user/refresh-token');

//                 localStorage.setItem('accessToken', data.accessToken);

//                 originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

//                 return httpClient(originalRequest);

//             } catch (refreshError) {

//                 localStorage.removeItem('accessToken');

//                 return Promise.reject(refreshError);

//             }
//         }

//         return Promise.reject(error);
//     }
// );


// httpClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (
//             error.response &&
//             error.response.status === 403 &&
//             error.response.data.message === 'User account is blocked'
//         ) {
//             logout()
//             localStorage.removeItem('accessToken');
//             window.location.href = '/'
//             toast.error("User blocked")
//         }
//         return Promise.reject(error);
//     }
// );


export default httpClient;
