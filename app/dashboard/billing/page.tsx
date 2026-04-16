'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiRefreshCw, FiCreditCard, FiUsers, FiZap } from 'react-icons/fi';
import { toast } from 'sonner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import { StatCard } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PageSpinner } from '@/components/feedback/Spinner';
import { formatDate } from '@/lib/formatters';
import type { PaginationMeta } from '@/types/api.types';

interface BillingSummary {
  totalFreeTrials: number;
  totalPro: number;
  total: number;
}

interface SubscriptionRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: 'free_trial' | 'pro';
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

interface BillingResponse {
  summary: BillingSummary;
  data: SubscriptionRow[];
  meta: PaginationMeta;
}

function PlanBadge({ plan }: { plan: SubscriptionRow['plan'] }) {
  return plan === 'pro'
    ? <Badge variant="purple">Pro</Badge>
    : <Badge variant="default">Trial</Badge>;
}

function StatusBadge({ status }: { status: SubscriptionRow['status'] }) {
  const map: Record<SubscriptionRow['status'], 'success' | 'warning' | 'danger' | 'default'> = {
    trialing: 'default',
    active: 'success',
    past_due: 'warning',
    canceled: 'danger',
    incomplete: 'warning',
  };
  return <Badge variant={map[status]}>{status.replace('_', ' ')}</Badge>;
}

export default function BillingPage() {
  const { isLoading: authLoading } = useAuth();
  const [billing, setBilling]   = useState<BillingResponse | null>(null);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [planFilter, setPlanFilter] = useState<'' | 'free_trial' | 'pro'>('');

  const fetchBilling = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (planFilter) params.set('plan', planFilter);
      const res = await api.get<BillingResponse>(`${API_ROUTES.BILLING}?${params}`);
      setBilling(res.data ?? null);
    } catch {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  }, [page, planFilter]);

  useEffect(() => { if (!authLoading) fetchBilling(); }, [authLoading, fetchBilling]);
  useEffect(() => { setPage(1); }, [planFilter]);

  if (authLoading) return <PageSpinner />;

  const summary = billing?.summary;
  const rows    = billing?.data ?? [];
  const meta    = billing?.meta ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <button
          onClick={fetchBilling}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Subscriptions"
          value={summary?.total ?? '—'}
          icon={<FiCreditCard size={20} />}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Pro Subscribers"
          value={summary?.totalPro ?? '—'}
          icon={<FiZap size={20} />}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Free Trial"
          value={summary?.totalFreeTrials ?? '—'}
          icon={<FiUsers size={20} />}
          color="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Filter:</span>
        {(['', 'free_trial', 'pro'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setPlanFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              planFilter === f
                ? 'bg-violet-600 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f === '' ? 'All' : f === 'pro' ? 'Pro' : 'Trial'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">{meta?.total ?? 0} subscriptions</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No subscriptions found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{row.userName}</p>
                  <p className="text-xs text-gray-400">{row.userEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PlanBadge plan={row.plan} />
                  <StatusBadge status={row.status} />
                  {row.cancelAtPeriodEnd && (
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">
                      Canceling
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-right text-xs text-gray-400">
                  {row.currentPeriodEnd
                    ? <>Next: {formatDate(row.currentPeriodEnd)}</>
                    : row.trialEndsAt
                    ? <>Trial ends: {formatDate(row.trialEndsAt)}</>
                    : <>Since: {formatDate(row.createdAt)}</>
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-sm text-gray-600">
            <p>Page {meta.page} of {meta.totalPages}</p>
            <div className="flex gap-2">
              <button disabled={!meta.hasPrev} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">Previous</button>
              <button disabled={!meta.hasNext} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-gray-200 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
