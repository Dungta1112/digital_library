'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string, refreshToken?: string) => void;
  updateUser: (partialUser: Partial<User>) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
          setToken(storedToken);
          // Fetch freshest user data from API
          const { AuthService } = await import('@/services/auth.service');
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        } else if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
          const { AuthService } = await import('@/services/auth.service');
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          setToken('mock-access-token-active');
        }
      } catch (e) {
        console.warn('Failed to init auth', e);
        // If fetch fails (e.g., 401), clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (u: User, t: string, r?: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('access_token', t);
    if (r) {
      localStorage.setItem('refresh_token', r);
    }
  };

  const updateUser = (partialUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : null));
  };

  const refreshUser = async (): Promise<User | null> => {
    try {
      const { AuthService } = await import('@/services/auth.service');
      const freshUser = await AuthService.getCurrentUser();
      setUser(freshUser);
      return freshUser;
    } catch (e) {
      console.warn('Failed to refresh user', e);
      return null;
    }
  };

  const logout = async () => {
    try {
      const { AuthService } = await import('@/services/auth.service');
      await AuthService.logout();
    } catch {
      // Ignore network errors
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, refreshUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
