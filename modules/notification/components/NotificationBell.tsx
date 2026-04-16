'use client';

import { FiBell } from 'react-icons/fi';
import { usePolling } from '../hooks/usePolling';

export function NotificationBell() {
  const count = usePolling();

  return (
    <div className="relative inline-flex items-center">
      <FiBell size={18} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}
