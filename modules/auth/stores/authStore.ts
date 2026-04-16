'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  createElement,
  type ReactNode,
} from 'react';
import { useSession } from '@/lib/auth-client';
import { authService } from '../services/authService';
import type { AuthContextValue } from '../types/auth.types';
import type { UserProfile, Session } from '@/types/common.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const data = await authService.getProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await authService.listSessions();
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      fetchProfile();
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [session?.user?.id, isPending, fetchProfile]);

  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!profile) return false;
      return Array.isArray(role) ? role.includes(profile.role) : profile.role === role;
    },
    [profile],
  );

  const value: AuthContextValue = {
    profile,
    isLoading: isPending || profileLoading,
    isAuthenticated: !!session?.user,
    hasRole,
    refetchProfile: fetchProfile,
    sessions,
    sessionsLoading,
    refetchSessions: fetchSessions,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
