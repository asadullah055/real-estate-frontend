'use client';

import { useEffect, useState } from 'react';
import { FiMonitor, FiSmartphone, FiTablet, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'sonner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { authService } from '@/modules/auth/services/authService';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PageSpinner } from '@/components/feedback/Spinner';
import { formatRelative } from '@/lib/formatters';
import type { Session } from '@/types/common.types';

function DeviceIcon({ device }: { device: string }) {
  if (device === 'Mobile') return <FiSmartphone size={18} className="text-gray-400" />;
  if (device === 'Tablet') return <FiTablet size={18} className="text-gray-400" />;
  return <FiMonitor size={18} className="text-gray-400" />;
}

export default function SessionsPage() {
  const { isLoading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setSessions(await authService.listSessions());
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading]);

  async function revokeOne(id: string) {
    setRevoking(id);
    try {
      await authService.revokeSession(id);
      toast.success('Session revoked');
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error('Failed to revoke session');
    } finally {
      setRevoking(null);
    }
  }

  async function revokeOthers() {
    setRevoking('others');
    try {
      await authService.revokeOtherSessions();
      toast.success('Other sessions revoked');
      await load();
    } catch {
      toast.error('Failed to revoke sessions');
    } finally {
      setRevoking(null);
    }
  }

  if (loading) return <PageSpinner />;

  const others = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Active Sessions</h1>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
          {others.length > 0 && (
            <button
              onClick={revokeOthers}
              disabled={revoking === 'others'}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <FiTrash2 size={14} /> Revoke Others
            </button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-gray-500">
            {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        <CardBody className="divide-y divide-gray-100 p-0">
          {sessions.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">No sessions found.</p>
          )}
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-6 py-4">
              <DeviceIcon device={s.deviceName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {s.browser} on {s.os}
                  </p>
                  {s.isCurrent && (
                    <Badge variant="success">Current</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {s.deviceName} · {formatRelative(s.lastActive)}
                </p>
              </div>
              {!s.isCurrent && (
                <button
                  onClick={() => revokeOne(s.id)}
                  disabled={revoking === s.id}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  aria-label="Revoke session"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
