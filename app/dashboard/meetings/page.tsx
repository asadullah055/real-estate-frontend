'use client';

import { useState } from 'react';
import { MeetingTable, useMeetings } from '@/modules/meeting';

export default function MeetingsPage() {
  const [page, setPage] = useState(1);
  const { data, meta, loading } = useMeetings(page, 20);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <p className="text-sm text-gray-500">Scheduled meetings and outcomes.</p>
      </div>

      <MeetingTable meetings={data} loading={loading} />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Page {meta.page} of {meta.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!meta.hasPrev} onClick={() => setPage((p) => p - 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">Previous</button>
            <button disabled={!meta.hasNext} onClick={() => setPage((p) => p + 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
