'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { callService, type Call } from '@/modules/call';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export default function CallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    callService.getById(id).then((res) => setCall(res.data ?? null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading call...</p>;
  if (!call) return <p className="text-sm text-gray-500">Call not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Call {call.retellCallId}</h1>
      <div className="rounded-xl border bg-white p-5 space-y-2">
        <p><span className="font-medium">Direction:</span> {call.direction}</p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <Badge variant={workflowStatusBadgeVariant(call.status)}>{call.status}</Badge>
        </p>
        <p><span className="font-medium">From:</span> {call.fromNumber ?? '-'}</p>
        <p><span className="font-medium">To:</span> {call.toNumber ?? '-'}</p>
        <p><span className="font-medium">Duration:</span> {call.durationSeconds ?? 0}s</p>
      </div>
      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-2 font-semibold text-gray-900">Transcript</h2>
        <p className="whitespace-pre-wrap text-sm text-gray-700">{call.transcript ?? 'No transcript available.'}</p>
      </div>
    </div>
  );
}

