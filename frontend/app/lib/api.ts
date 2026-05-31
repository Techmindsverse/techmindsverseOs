import axios from 'axios';

let isRedirecting = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tmv_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tmv_token');
        document.cookie = 'tmv_token=; path=/; max-age=0';
        document.cookie = 'tmv_role=; path=/; max-age=0';
        window.location.href = '/login';
      }
      setTimeout(() => { isRedirecting = false; }, 3000);
    }
    return Promise.reject(error);
  }
);

export default api;