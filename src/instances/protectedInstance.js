import axios from "axios";

const baseURL = 'https://e-commerce-backend-e2mm.onrender.com/api/v1';

const protectedInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true 
});

export default protectedInstance;