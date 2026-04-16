'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Table from '@/components/ui/Table';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';

interface FollowupInquiry {
  name?: string;
  phone?: string;
  email?: string;
}

interface FollowupItem {
  id?: string;
  _id?: string;
  leadId?: string;
  sequenceId?: string;
  stepNumber?: number;
  type?: string;
  status?: string;
  scheduledAt?: string;
  sentAt?: string;
  inquiry?: FollowupInquiry;
}

export default function FollowupsPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<FollowupItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get<FollowupItem[]>(API_ROUTES.FOLLOWUPS)
      .then((res) => setItems(res.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const haystack = [
        item.inquiry?.name,
        item.inquiry?.phone,
        item.inquiry?.email,
        item.sequenceId,
        item.leadId,
        item.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, search]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Followups</h1>
          <p className="text-sm text-gray-500">Inquiry submissions are queued here for follow-up contact.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search follow-ups"
          className="w-72 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <Table
        loading={loading}
        emptyMessage="No follow-ups found."
        keyExtractor={(item) => item.id ?? item._id ?? `${item.sequenceId}-${item.stepNumber}-${item.scheduledAt}`}
        data={filteredItems}
        columns={[
          {
            header: 'Customer',
            accessor: (item: FollowupItem) => (
              <div>
                <p className="font-medium text-gray-900">{item.inquiry?.name ?? 'Unknown'}</p>
                <p className="text-xs text-gray-500">{item.inquiry?.email ?? '-'}</p>
              </div>
            ),
          },
          { header: 'Phone', accessor: (item: FollowupItem) => item.inquiry?.phone ?? '-' },
          { header: 'Type', accessor: (item: FollowupItem) => item.type ?? '-' },
          {
            header: 'Status',
            accessor: (item: FollowupItem) => (
              <Badge variant={workflowStatusBadgeVariant(item.status ?? '')}>
                {item.status ?? '-'}
              </Badge>
            ),
          },
          {
            header: 'Scheduled',
            accessor: (item: FollowupItem) => item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : '-',
          },
          { header: 'Sequence', accessor: (item: FollowupItem) => item.sequenceId ?? '-' },
          {
            header: '',
            accessor: (item: FollowupItem) =>
              item.leadId ? (
                <Link href={`/dashboard/leads/${item.leadId}`} className="text-violet-600 hover:text-violet-700">
                  View Lead
                </Link>
              ) : null,
          },
        ]}
      />

      <p className="text-xs text-gray-500">Total follow-ups: {filteredItems.length}</p>
    </div>
  );
}
