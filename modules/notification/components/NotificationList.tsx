import type { NotificationItem } from '../types/notification.types';
import Table from '@/components/ui/Table';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export function NotificationList({
  items,
  loading,
  onMarkRead,
}: {
  items: NotificationItem[];
  loading?: boolean;
  onMarkRead: (id: string) => void;
}) {
  return (
    <Table
      loading={loading}
      emptyMessage="No notifications."
      keyExtractor={(item) => item.id}
      data={items}
      columns={[
        {
          header: 'Title',
          accessor: (item) => (
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.message}</p>
            </div>
          ),
        },
        { header: 'Type', accessor: (item) => <Badge>{item.type}</Badge> },
        {
          header: 'Status',
          accessor: (item) => {
            const label = item.read ? 'Read' : 'Unread';
            return <Badge variant={workflowStatusBadgeVariant(label)}>{label}</Badge>;
          },
        },
        {
          header: '',
          accessor: (item) => (
            <button
              className="text-violet-600 hover:text-violet-700 disabled:text-gray-300"
              disabled={item.read}
              onClick={() => onMarkRead(item.id)}
            >
              Mark read
            </button>
          ),
        },
      ]}
    />
  );
}
