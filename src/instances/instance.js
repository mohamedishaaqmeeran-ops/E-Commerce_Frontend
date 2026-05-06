import axios from "axios";

const baseURL = 'https://e-commerce-backend-e2mm.onrender.com/api/v1';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true 
});


instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default instance;