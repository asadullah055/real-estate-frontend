import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { Meeting } from '../types/meeting.types';
import type { ApiResponse } from '@/types/api.types';

export const meetingService = {
  async list(params: URLSearchParams): Promise<ApiResponse<Meeting[]>> {
    return api.get<Meeting[]>(`${API_ROUTES.MEETINGS}?${params.toString()}`);
  },

  async upcoming(): Promise<ApiResponse<Meeting[]>> {
    return api.get<Meeting[]>(`${API_ROUTES.MEETINGS}/upcoming`);
  },
};
