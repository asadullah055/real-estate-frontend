'use client';

import { useEffect, useState } from 'react';
import type { NotificationItem } from '../types/notification.types';
import type { PaginationMeta } from '@/types/api.types';
import { notificationService } from '../services/notificationService';

export function useNotifications(page = 1, limit = 20) {
  const [data, setData] = useState<NotificationItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    notificationService
      .list(params)
      .then((res) => {
        setData(res.data ?? []);
        setMeta(res.meta ?? null);
      })
      .catch(() => {
        setData([]);
        setMeta(null);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  return { data, meta, loading, setData };
}

