'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { leadService, type Lead } from '@/modules/lead';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    leadService.getById(id).then((res) => setLead(res.data ?? null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading lead...</p>;
  if (!lead) return <p className="text-sm text-gray-500">Lead not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
      <div className="rounded-xl border bg-white p-5 space-y-2">
        <p><span className="font-medium">Email:</span> {lead.email ?? '-'}</p>
        <p><span className="font-medium">Phone:</span> {lead.phone}</p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <Badge variant={workflowStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
        </p>
        <p><span className="font-medium">Score:</span> {lead.score} ({lead.scoreCategory})</p>
        <p><span className="font-medium">Source:</span> {lead.source}</p>
      </div>
    </div>
  );
}

