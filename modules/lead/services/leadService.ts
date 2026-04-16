import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { Lead } from '../types/lead.types';
import type { ApiResponse } from '@/types/api.types';

export const leadService = {
  async list(params: URLSearchParams): Promise<ApiResponse<Lead[]>> {
    return api.get<Lead[]>(`${API_ROUTES.LEADS}?${params.toString()}`);
  },

  async getById(id: string): Promise<ApiResponse<Lead>> {
    return api.get<Lead>(`${API_ROUTES.LEADS}/${id}`);
  },
};
