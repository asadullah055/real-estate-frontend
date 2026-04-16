import Link from 'next/link';
import type { Call } from '../types/call.types';
import Table from '@/components/ui/Table';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export function CallList({ calls, loading }: { calls: Call[]; loading?: boolean }) {
  return (
    <Table
      loading={loading}
      emptyMessage="No calls found."
      keyExtractor={(call) => call.id}
      data={calls}
      columns={[
        { header: 'Direction', accessor: (call) => call.direction },
        {
          header: 'Status',
          accessor: (call) => (
            <Badge variant={workflowStatusBadgeVariant(call.status)}>
              {call.status}
            </Badge>
          ),
        },
        { header: 'From', accessor: (call) => call.fromNumber ?? '-' },
        { header: 'To', accessor: (call) => call.toNumber ?? '-' },
        { header: 'Duration', accessor: (call) => `${call.durationSeconds ?? 0}s` },
        {
          header: '',
          accessor: (call) => (
            <Link href={`/dashboard/calls/${call.id}`} className="text-violet-600 hover:text-violet-700">
              View
            </Link>
          ),
        },
      ]}
    />
  );
}
