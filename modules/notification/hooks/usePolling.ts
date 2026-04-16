'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

export function usePolling(intervalMs = 30000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchCount = () => {
      notificationService
        .unreadCount()
        .then((res) => {
          if (mounted) setCount(res.data?.count ?? 0);
        })
        .catch(() => null);
    };

    fetchCount();
    const timer = setInterval(fetchCount, intervalMs);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return count;
}
