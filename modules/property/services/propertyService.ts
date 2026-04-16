import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { Property } from '../types/property.types';
import type { ApiResponse } from '@/types/api.types';

export const propertyService = {
  async list(params: URLSearchParams): Promise<ApiResponse<Property[]>> {
    return api.get<Property[]>(`${API_ROUTES.PROPERTIES}?${params.toString()}`);
  },

  async getById(id: string): Promise<ApiResponse<Property>> {
    return api.get<Property>(`${API_ROUTES.PROPERTIES}/${id}`);
  },
};
