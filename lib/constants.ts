export const API_ROUTES = {
  PROFILE:                 '/api/profile',
  USERS:                   '/api/users',
  ADMIN:                   '/api/admin',
  SESSIONS:                '/api/sessions',
  SESSIONS_REVOKE:         '/api/sessions/revoke',
  SESSIONS_REVOKE_OTHERS:  '/api/sessions/revoke-others',
  STATS:                   '/api/stats',
  ANALYTICS:               '/api/analytics',
  ANALYTICS_OVERVIEW:      '/api/analytics/overview',
  ANALYTICS_SNAPSHOTS:     '/api/analytics/snapshots',
  BILLING:                 '/api/subscription/billing',
  LEADS:                   '/api/leads',
  PROPERTIES:              '/api/properties',
  CALLS:                   '/api/calls',
  MEETINGS:                '/api/meetings',
  FOLLOWUPS:               '/api/followups',
  NOTIFICATIONS:           '/api/notifications',
} as const;

export const APP_NAME = 'NebulaNexus';
