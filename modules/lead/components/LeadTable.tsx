import Link from 'next/link';
import type { Lead } from '../types/lead.types';
import Table from '@/components/ui/Table';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export function LeadTable({ leads, loading }: { leads: Lead[]; loading?: boolean }) {
  return (
    <Table
      loading={loading}
      emptyMessage="No leads found."
      keyExtractor={(lead) => lead.id}
      data={leads}
      columns={[
        {
          header: 'Lead',
          accessor: (lead) => (
            <div>
              <p className="font-medium text-gray-900">{lead.name}</p>
              <p className="text-xs text-gray-500">{lead.email ?? lead.phone}</p>
            </div>
          ),
        },
        { header: 'Phone', accessor: (lead) => lead.phone },
        {
          header: 'Status',
          accessor: (lead) => (
            <Badge variant={workflowStatusBadgeVariant(lead.status)}>
              {lead.status}
            </Badge>
          ),
        },
        { header: 'Score', accessor: (lead) => `${lead.score} (${lead.scoreCategory})` },
        {
          header: '',
          accessor: (lead) => (
            <Link href={`/dashboard/leads/${lead.id}`} className="text-violet-600 hover:text-violet-700">
              View
            </Link>
          ),
        },
      ]}
    />
  );
}
