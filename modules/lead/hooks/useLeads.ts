'use client';

import { useEffect, useState } from 'react';
import type { Lead } from '../types/lead.types';
import type { PaginationMeta } from '@/types/api.types';
import { leadService } from '../services/leadService';

export function useLeads(page = 1, limit = 20, search = '', talkedOnly = false, statuses: string[] = []) {
  const [data, setData] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const statusesKey = statuses.join(',');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (talkedOnly) params.set('talked', 'true');
    if (statuses.length) params.set('statuses', statusesKey);
    leadService
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
  }, [page, limit, search, talkedOnly, statuses.length, statusesKey, refreshKey]);

  const refetch = () => setRefreshKey((prev) => prev + 1);

  return { data, meta, loading, refetch };
}

