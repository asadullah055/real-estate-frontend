'use client';

import { useState } from 'react';
import { NotificationList, notificationService, useNotifications } from '@/modules/notification';

export default function NotificationsPage() {
  const [page] = useState(1);
  const { data, loading, setData } = useNotifications(page, 30);

  const onMarkRead = (id: string) => {
    notificationService.markRead(id)
      .then((res) => {
        const updated = res.data;
        if (!updated) return;
        setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      })
      .catch(() => null);
  };

  const markAll = () => {
    notificationService.markAllRead()
      .then(() => setData((prev) => prev.map((item) => ({ ...item, read: true }))))
      .catch(() => null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">Workspace alerts and reminders.</p>
        </div>
        <button onClick={markAll} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700">
          Mark all as read
        </button>
      </div>

      <NotificationList items={data} loading={loading} onMarkRead={onMarkRead} />
    </div>
  );
}
