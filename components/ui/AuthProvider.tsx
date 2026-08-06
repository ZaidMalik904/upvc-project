'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentSession, setCurrentSession } from '@/lib/auth';
import { AuthSession } from '@/types/auth';

interface AuthContextType {
  session: AuthSession | null;
  login: (session: AuthSession) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial session on mount
    const currentSession = getCurrentSession();
    if (currentSession) {
      // Check expiry (mock implementation, expiry is string for simplicity, can be date)
      if (new Date(currentSession.expiresAt) < new Date()) {
        setCurrentSession(null);
        setSessionState(null);
      } else {
        setSessionState(currentSession);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newSession: AuthSession) => {
    setCurrentSession(newSession);
    setSessionState(newSession);
    router.push('/dashboard');
  };

  const logout = () => {
    setCurrentSession(null);
    setSessionState(null);
    router.push('/login');
  };

  // Route protection
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = pathname === '/login' || pathname === '/signup';
      if (!session && !isPublicRoute) {
        router.push('/login');
      } else if (session && isPublicRoute) {
        router.push('/dashboard');
      }
    }
  }, [session, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
