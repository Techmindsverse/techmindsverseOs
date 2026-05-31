import { create } from 'zustand';
import { UserRole, ModuleName } from '../auth/permissions';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  roles: UserRole[];
  modules?: ModuleName[];
  status?: string;
  username?: string;
  avatar_url?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isHydrated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasModule: (module: ModuleName) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  getRoles: () => UserRole[];
  hydrate: () => void;
}

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Strict`;
};

const clearCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('tmv_token');
    const userStr = localStorage.getItem('tmv_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({ user, token, isHydrated: true });
      } catch {
        set({ isHydrated: true });
      }
    } else {
      set({ isHydrated: true });
    }
  },

  setAuth: (user, token) => {
    set({ user, token, isHydrated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('tmv_token', token);
      localStorage.setItem('tmv_user', JSON.stringify(user));
      setCookie('tmv_token', token);
      setCookie('tmv_role', user.role);
    }
  },

  clearAuth: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tmv_token');
      localStorage.removeItem('tmv_user');
      clearCookie('tmv_token');
      clearCookie('tmv_role');
    }
  },

  updateUser: (updates) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    set({ user: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem('tmv_user', JSON.stringify(updated));
    }
  },

  hasRole: (role) => {
    const { user } = get();
    if (!user) return false;
    const roles = user.roles || [user.role];
    if (roles.includes('super_admin') || roles.includes('admin'))
      return true;
    const required = Array.isArray(role) ? role : [role];
    return required.some((r) => roles.includes(r));
  },

  hasModule: (module) => {
    const { user } = get();
    if (!user) return false;
    const roles = user.roles || [user.role];
    if (roles.includes('admin') || roles.includes('super_admin'))
      return true;
    return (user.modules || []).includes(module);
  },

  isAdmin: () => {
    const { user } = get();
    if (!user) return false;
    const roles = user.roles || [user.role];
    return roles.includes('admin') || roles.includes('super_admin');
  },

  isSuperAdmin: () => {
    const { user } = get();
    if (!user) return false;
    const roles = user.roles || [user.role];
    return roles.includes('super_admin');
  },

  getRoles: () => {
    const { user } = get();
    return user?.roles || (user?.role ? [user.role] : []);
  },
}));