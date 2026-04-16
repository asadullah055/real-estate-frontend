'use client';

import { useState } from 'react';
import { useLeads, LeadTable } from '@/modules/lead';

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, meta, loading } = useLeads(page, 20, search, true);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500">Only leads with conversation activity are shown here.</p>
        </div>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search leads"
          className="w-64 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </div>

      <LeadTable leads={data} loading={loading} />

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
