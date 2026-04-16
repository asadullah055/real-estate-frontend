'use client';

import { useEffect, useState } from 'react';
import type { Call } from '../types/call.types';
import type { PaginationMeta } from '@/types/api.types';
import { callService } from '../services/callService';

export function useCalls(page = 1, limit = 20, refreshKey = 0) {
  const [data, setData] = useState<Call[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    callService
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
  }, [page, limit, refreshKey]);

  return { data, meta, loading };
}

