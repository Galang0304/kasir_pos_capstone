import axios from 'axios';

// Use production API URL for Vercel, fallback to localhost for development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://kasirposta.lopigo.tech/api-kasir/api'
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

const instance = axios.create({
  baseURL: API_URL
});

// Add token to requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
