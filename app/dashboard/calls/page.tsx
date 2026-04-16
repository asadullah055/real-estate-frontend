'use client';

import { useCallback, useState } from 'react';
import { CallList, useCalls } from '@/modules/call';
import { callService } from '@/modules/call/services/callService';

export default function CallsPage() {
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, meta, loading } = useCalls(page, 20, refreshKey);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; skipped: number } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    try {
      const res = await callService.syncFromRetell({ limit: 100 });
      setSyncResult(res.data ?? null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setSyncError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calls</h1>
          <p className="text-sm text-gray-500">Retell call logs and transcripts.</p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {syncing ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Syncing…
            </>
          ) : (
            'Sync from Retell'
          )}
        </button>
      </div>

      {syncResult && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Sync complete — <strong>{syncResult.synced}</strong> calls imported, {syncResult.skipped} skipped (already in DB or no phone).
        </div>
      )}

      {syncError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {syncError}
        </div>
      )}

      <CallList calls={data} loading={loading} />

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
