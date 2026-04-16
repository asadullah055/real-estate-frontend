export interface NotificationItem {
  id: string;
  workspaceId: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  readAt?: string;
  createdAt: string;
}
