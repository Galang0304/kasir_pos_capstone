import axios from 'axios';

// Use production API URL - same domain for VPS hosting
const API_URL = process.env.REACT_APP_API_URL || '/api';

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
