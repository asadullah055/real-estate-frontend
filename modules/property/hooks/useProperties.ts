'use client';

import { useEffect, useState } from 'react';
import type { Property } from '../types/property.types';
import type { PaginationMeta } from '@/types/api.types';
import { propertyService } from '../services/propertyService';

export function useProperties(page = 1, limit = 20, search = '') {
  const [data, setData] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    propertyService
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
  }, [page, limit, search]);

  return { data, meta, loading };
}

