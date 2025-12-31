/**
 * HOOK DE AUTENTICACIÓN
 * Maneja login, logout, y estado de usuario
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, setAuthTokens, clearAuthTokens } from '../lib/api-client';

// Tipos
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'filial' | 'oficial';
  houseId?: number;
  twoFactorEnabled: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<any>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<any>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

// Store de autenticación
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (email: string, password: string, twoFactorCode?: string) => {
        try {
          set({ isLoading: true });

          const response = await apiClient.post('/auth/login', {
            email,
            password,
            twoFactorCode,
          });

          // Si requiere 2FA
          if (response.data.requires2FA) {
            return { requires2FA: true, tempToken: response.data.tempToken };
          }

          // Login exitoso
          const { user, accessToken, refreshToken } = response.data;

          setAuthTokens(accessToken, refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user };
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
      },

      // Logout
      logout: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
          }
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          clearAuthTokens();
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // Register
      register: async (data: any) => {
        try {
          set({ isLoading: true });

          const response = await apiClient.post('/auth/register', data);

          const { user, accessToken, refreshToken } = response.data;

          setAuthTokens(accessToken, refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user };
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Error al registrar');
        }
      },

      // Set user (para actualizaciones)
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      // Verificar autenticación
      checkAuth: async () => {
        try {
          const token = localStorage.getItem('accessToken');

          if (!token) {
            set({ user: null, isAuthenticated: false });
            return;
          }

          const response = await apiClient.get('/auth/me');

          set({
            user: response.data,
            isAuthenticated: true,
          });
        } catch (error) {
          clearAuthTokens();
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);