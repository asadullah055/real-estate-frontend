'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiRefreshCw, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import { useDebounce } from '@/hooks/useDebounce';
import Table from '@/components/ui/Table';
import Badge, { roleBadgeVariant, statusBadgeVariant } from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { PageSpinner } from '@/components/feedback/Spinner';
import { formatDate } from '@/lib/formatters';
import type { UserProfile } from '@/types/common.types';
import type { PaginationMeta } from '@/types/api.types';

// ── User Detail Modal ────────────────────────────────────────────────────────

function UserDetailModal({
  user,
  onClose,
  onStatusChange,
}: {
  user: UserProfile;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);

  async function toggleStatus() {
    const next = user.status === 'active' ? 'suspended' : 'active';
    setUpdating(true);
    try {
      await api.patch(`/api/users/${user.id}/status`, { status: next });
      toast.success(`User ${next === 'active' ? 'activated' : 'suspended'}`);
      onStatusChange(user.id, next);
      onClose();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
          <Avatar name={user.name} src={user.avatarUrl} size="md" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">✕</button>
        </div>

        {/* Details */}
        <div className="space-y-3 px-6 py-5">
          <Row label="Role">
            <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
          </Row>
          <Row label="Status">
            <Badge variant={statusBadgeVariant(user.status)}>{user.status}</Badge>
          </Row>
          <Row label="Joined"><span className="text-sm text-gray-700">{formatDate(user.createdAt)}</span></Row>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
          {user.role !== 'super-admin' && (
            <button
              onClick={toggleStatus}
              disabled={updating}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                user.status === 'active'
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              {user.status === 'active'
                ? <><FiXCircle size={14} /> Suspend</>
                : <><FiCheckCircle size={14} /> Activate</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}

// ── Users Page ───────────────────────────────────────────────────────────────

export default function UsersPage() {
  const { isLoading: authLoading } = useAuth();
  const [users, setUsers]       = useState<UserProfile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [meta, setMeta]         = useState<PaginationMeta | null>(null);
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await api.get<UserProfile[]>(`${API_ROUTES.USERS}?${params}`);
      setUsers(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { if (!authLoading) fetchUsers(); }, [authLoading, fetchUsers]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  function handleStatusChange(id: string, status: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: status as UserProfile['status'] } : u)),
    );
  }

  if (authLoading) return <PageSpinner />;

  return (
    <div className="space-y-5">
      {selected && (
        <UserDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          {meta && <p className="text-sm text-gray-500">{meta.total} total</p>}
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <Table
        loading={loading}
        emptyMessage="No users found."
        keyExtractor={(u) => u.id}
        data={users}
        columns={[
          {
            header: 'User',
            accessor: (u) => (
              <div className="flex items-center gap-3">
                <Avatar name={u.name} src={u.avatarUrl} size="sm" />
                <div>
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            header: 'Role',
            accessor: (u) => <Badge variant={roleBadgeVariant(u.role)}>{u.role}</Badge>,
          },
          {
            header: 'Status',
            accessor: (u) => <Badge variant={statusBadgeVariant(u.status)}>{u.status}</Badge>,
          },
          {
            header: 'Joined',
            accessor: (u) => formatDate(u.createdAt),
            className: 'hidden md:table-cell',
          },
          {
            header: '',
            accessor: (u) => (
              <button
                onClick={() => setSelected(u)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="View details"
              >
                <FiEye size={15} />
              </button>
            ),
            className: 'w-10',
          },
        ]}
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Page {meta.page} of {meta.totalPages} · {meta.total} users</p>
          <div className="flex gap-2">
            <button disabled={!meta.hasPrev} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">Previous</button>
            <button disabled={!meta.hasNext} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
