import axios from 'axios';

let isRedirecting = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tmv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !isRedirecting &&
      typeof window !== 'undefined'
    ) {
      // Only redirect if we actually had a token (not just missing auth)
      const hadToken = !!localStorage.getItem('tmv_token');
      if (hadToken) {
        isRedirecting = true;
        localStorage.removeItem('tmv_token');
        localStorage.removeItem('tmv_user');
        document.cookie = 'tmv_token=; path=/; max-age=0';
        document.cookie = 'tmv_role=; path=/; max-age=0';
        // Small delay to prevent race conditions
        setTimeout(() => {
          window.location.href = '/login';
          isRedirecting = false;
        }, 100);
      }
    }
    return Promise.reject(error);
  },
);

export default api;