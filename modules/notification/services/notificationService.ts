import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import type { ApiResponse } from '@/types/api.types';
import type { NotificationItem } from '../types/notification.types';

export const notificationService = {
  async list(params: URLSearchParams): Promise<ApiResponse<NotificationItem[]>> {
    return api.get<NotificationItem[]>(`${API_ROUTES.NOTIFICATIONS}?${params.toString()}`);
  },

  async unreadCount(): Promise<ApiResponse<{ count: number }>> {
    return api.get<{ count: number }>(`${API_ROUTES.NOTIFICATIONS}/unread-count`);
  },

  async markRead(id: string): Promise<ApiResponse<NotificationItem>> {
    return api.patch<NotificationItem>(`${API_ROUTES.NOTIFICATIONS}/${id}/read`);
  },

  async markAllRead(): Promise<ApiResponse<{ modifiedCount: number }>> {
    return api.patch<{ modifiedCount: number }>(`${API_ROUTES.NOTIFICATIONS}/read-all`);
  },
};
