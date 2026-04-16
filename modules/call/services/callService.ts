import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { Call } from '../types/call.types';
import type { ApiResponse } from '@/types/api.types';

export const callService = {
  async list(params: URLSearchParams): Promise<ApiResponse<Call[]>> {
    return api.get<Call[]>(`${API_ROUTES.CALLS}?${params.toString()}`);
  },

  async getById(id: string): Promise<ApiResponse<Call>> {
    return api.get<Call>(`${API_ROUTES.CALLS}/${id}`);
  },

  async syncFromRetell(options?: {
    limit?: number;
    agentId?: string;
  }): Promise<ApiResponse<{ synced: number; skipped: number }>> {
    return api.post(`${API_ROUTES.CALLS}/sync-retell`, options ?? {});
  },
};
