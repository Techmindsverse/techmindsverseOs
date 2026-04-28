import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tmv_token', token);
      document.cookie = `tmv_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    }
    set({ user, token });
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tmv_token');
      document.cookie = 'tmv_token=; path=/; max-age=0';
    }
    set({ user: null, token: null });
  },
}));