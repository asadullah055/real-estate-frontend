'use client';

import { useEffect, useState } from 'react';
import type { Meeting } from '../types/meeting.types';
import type { PaginationMeta } from '@/types/api.types';
import { meetingService } from '../services/meetingService';

export function useMeetings(page = 1, limit = 20) {
  const [data, setData] = useState<Meeting[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    meetingService
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

  return { data, meta, loading };
}

