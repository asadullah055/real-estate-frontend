export type Role = 'super-admin' | 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'suspended' | 'pending';
  avatarUrl?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}
