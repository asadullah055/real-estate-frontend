import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { UserProfile, Session } from '@/types/common.types';

export const authService = {
  async getProfile(): Promise<UserProfile> {
    const res = await api.get<UserProfile>(API_ROUTES.PROFILE);
    if (!res.data) throw new Error('No profile data');
    return res.data;
  },

  async listSessions(): Promise<Session[]> {
    const res = await api.get<Session[]>(API_ROUTES.SESSIONS);
    return res.data ?? [];
  },

  async revokeSession(sessionId: string): Promise<void> {
    await api.post(API_ROUTES.SESSIONS_REVOKE, { sessionId });
  },

  async revokeOtherSessions(): Promise<void> {
    await api.post(API_ROUTES.SESSIONS_REVOKE_OTHERS);
  },
};
