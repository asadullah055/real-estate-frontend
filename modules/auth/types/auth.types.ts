import type { UserProfile, Session } from '@/types/common.types';

export interface AuthState {
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  hasRole: (role: string | string[]) => boolean;
  refetchProfile: () => Promise<void>;
  sessions: Session[];
  sessionsLoading: boolean;
  refetchSessions: () => Promise<void>;
}
