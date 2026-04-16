'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
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

// ── Create Admin Modal ───────────────────────────────────────────────────────

function CreateAdminModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (admin: UserProfile) => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post<UserProfile>(API_ROUTES.ADMIN, { email, name });
      toast.success('Admin created');
      onCreated(res.data!);
      onClose();
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Create Admin" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className={inputCls}
            placeholder="Full name"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputCls}
            placeholder="admin@example.com"
          />
        </Field>
        <p className="text-xs text-gray-400">
          If the email already belongs to a user, they will be promoted to admin.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryCls}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryCls}>
            {saving ? 'Creating…' : 'Create Admin'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Edit Admin Modal ─────────────────────────────────────────────────────────

function EditAdminModal({
  admin,
  onClose,
  onUpdated,
}: {
  admin: UserProfile;
  onClose: () => void;
  onUpdated: (updated: UserProfile) => void;
}) {
  const [name, setName]   = useState(admin.name);
  const [status, setStatus] = useState<'active' | 'suspended' | 'pending'>(
    admin.status as 'active' | 'suspended' | 'pending',
  );
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch<UserProfile>(`${API_ROUTES.ADMIN}/${admin.id}`, { name, status });
      toast.success('Admin updated');
      onUpdated(res.data!);
      onClose();
    } catch {
      toast.error('Failed to update admin');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Edit Admin" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className={inputCls}
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className={inputCls}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={secondaryCls}>Cancel</button>
          <button type="submit" disabled={saving} className={primaryCls}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Delete Confirm Modal ─────────────────────────────────────────────────────

function DeleteConfirmModal({
  admin,
  onClose,
  onDeleted,
}: {
  admin: UserProfile;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`${API_ROUTES.ADMIN}/${admin.id}`);
      toast.success('Admin deleted');
      onDeleted(admin.id);
      onClose();
    } catch {
      toast.error('Failed to delete admin');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Delete Admin" onClose={onClose}>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete <strong>{admin.name}</strong>?
        This removes their admin profile. If they have a login, they cannot access the dashboard.
      </p>
      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onClose} className={secondaryCls}>Cancel</button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}

// ── Shared primitives ────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100';
const primaryCls = 'rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50';
const secondaryCls = 'rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50';

// ── Admins Page ──────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; admin: UserProfile }
  | { type: 'delete'; admin: UserProfile }
  | null;

export default function AdminsPage() {
  const { hasRole, isLoading: authLoading } = useAuth();
  const [admins, setAdmins]   = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [meta, setMeta]       = useState<PaginationMeta | null>(null);
  const [modal, setModal]     = useState<ModalState>(null);
  const debouncedSearch = useDebounce(search, 400);
  const isSuperAdmin = hasRole('super-admin');

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await api.get<UserProfile[]>(`${API_ROUTES.ADMIN}?${params}`);
      setAdmins(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { if (!authLoading) fetchAdmins(); }, [authLoading, fetchAdmins]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  if (authLoading) return <PageSpinner />;

  return (
    <div className="space-y-5">
      {modal?.type === 'create' && (
        <CreateAdminModal
          onClose={() => setModal(null)}
          onCreated={(a) => setAdmins((prev) => [a, ...prev])}
        />
      )}
      {modal?.type === 'edit' && (
        <EditAdminModal
          admin={modal.admin}
          onClose={() => setModal(null)}
          onUpdated={(updated) =>
            setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
          }
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteConfirmModal
          admin={modal.admin}
          onClose={() => setModal(null)}
          onDeleted={(id) => setAdmins((prev) => prev.filter((a) => a.id !== id))}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
          {meta && <p className="text-sm text-gray-500">{meta.total} total</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAdmins} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <FiRefreshCw size={14} /> Refresh
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setModal({ type: 'create' })}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
            >
              <FiPlus size={14} /> Add Admin
            </button>
          )}
        </div>
      </div>

      <div className="relative max-w-sm">
        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search admins…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <Table
        loading={loading}
        emptyMessage="No admins found."
        keyExtractor={(u) => u.id}
        data={admins}
        columns={[
          {
            header: 'Admin',
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
          ...(isSuperAdmin
            ? [{
                header: '',
                accessor: (u: UserProfile) => u.role === 'super-admin' ? null : (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setModal({ type: 'edit', admin: u })}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      aria-label="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => setModal({ type: 'delete', admin: u })}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ),
                className: 'w-20',
              }]
            : []),
        ]}
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Page {meta.page} of {meta.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!meta.hasPrev} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">Previous</button>
            <button disabled={!meta.hasNext} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
