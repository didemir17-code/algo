'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, UserStats } from '@/lib/types';
import { sound } from '@/lib/sound';

interface RegisterData {
  username: string;
  name: string;
  password: string;
  grade?: string;
  avatar?: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  syncStatsToCloud: (stats: UserStats) => Promise<void>;
  updateLocalUserStats: (stats: UserStats) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Check initial session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        sound.playSuccess();
        closeAuthModal();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Giriş başarısız oldu.' };
      }
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'Bağlantı hatası oluştu.' };
    }
  };

  const register = async (formData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        sound.playSuccess();
        closeAuthModal();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Kayıt başarısız oldu.' };
      }
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'Bağlantı hatası oluştu.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      sound.playPop();
    }
  };

  const syncStatsToCloud = async (stats: UserStats) => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.progress) {
          setUser((prev) => (prev ? { ...prev, stats: data.progress } : null));
        }
      }
    } catch (err) {
      console.error('Failed to sync stats to cloud:', err);
    }
  };

  const updateLocalUserStats = (stats: UserStats) => {
    setUser((prev) => (prev ? { ...prev, stats } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        syncStatsToCloud,
        updateLocalUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
