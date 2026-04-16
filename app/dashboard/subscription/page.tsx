'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiAlertCircle, FiExternalLink, FiZap, FiClock } from 'react-icons/fi';
import { toast } from 'sonner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import {
  subscriptionService,
  type Subscription,
  type Invoice,
} from '@/modules/subscription/subscriptionService';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PageSpinner } from '@/components/feedback/Spinner';
import { formatDate } from '@/lib/formatters';

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function StatusBadge({ status }: { status: Subscription['status'] }) {
  const map: Record<Subscription['status'], 'success' | 'warning' | 'danger' | 'default'> = {
    trialing: 'default',
    active: 'success',
    past_due: 'warning',
    canceled: 'danger',
    incomplete: 'warning',
  };
  const labels: Record<Subscription['status'], string> = {
    trialing: 'Trial',
    active: 'Active',
    past_due: 'Past Due',
    canceled: 'Canceled',
    incomplete: 'Incomplete',
  };
  return <Badge variant={map[status]}>{labels[status]}</Badge>;
}

export default function SubscriptionPage() {
  return (
    <Suspense>
      <SubscriptionPageInner />
    </Suspense>
  );
}

function SubscriptionPageInner() {
  const { isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();

  const [sub, setSub] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      toast.success('Subscription upgraded to Pro!');
    } else if (searchParams.get('canceled') === '1') {
      toast.info('Checkout canceled.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;

    async function load() {
      setLoading(true);
      try {
        const [subData, invoiceData] = await Promise.all([
          subscriptionService.getSubscription(),
          subscriptionService.getInvoices(),
        ]);
        setSub(subData);
        setInvoices(invoiceData);
      } catch {
        toast.error('Failed to load subscription');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading]);

  async function handleUpgrade() {
    setActionLoading(true);
    try {
      const url = await subscriptionService.createCheckout(window.location.origin);
      window.location.href = url;
    } catch {
      toast.error('Failed to start checkout');
      setActionLoading(false);
    }
  }

  async function handleCancelAtPeriodEnd() {
    setActionLoading(true);
    try {
      const updated = await subscriptionService.cancelSubscription();
      setSub(updated);
      toast.success('Subscription will cancel at period end');
    } catch {
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResumeSubscription() {
    setActionLoading(true);
    try {
      const updated = await subscriptionService.resumeSubscription();
      setSub(updated);
      toast.success('Subscription resumed');
    } catch {
      toast.error('Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <PageSpinner />;

  const isPro = sub?.plan === 'pro' && (sub.status === 'active' || sub.status === 'past_due');
  const isTrial = sub?.plan === 'free_trial' || sub?.status === 'trialing';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>

      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-gray-500">Current Plan</p>
        </CardHeader>
        <CardBody>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {isPro ? 'Pro' : 'Free Trial'}
                </span>
                {sub && <StatusBadge status={sub.status} />}
              </div>

              {isTrial && sub?.trialEndsAt && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FiClock size={14} />
                  Trial ends {formatDate(sub.trialEndsAt)}
                </p>
              )}

              {isPro && sub?.currentPeriodEnd && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
                  <FiCheckCircle size={14} className="text-green-500" />
                  {sub.cancelAtPeriodEnd
                    ? `Cancels on ${formatDate(sub.currentPeriodEnd)}`
                    : `Next payment on ${formatDate(sub.currentPeriodEnd)}`}
                </p>
              )}

              {sub?.status === 'past_due' && (
                <p className="flex items-center gap-1.5 text-sm text-red-600">
                  <FiAlertCircle size={14} />
                  Payment failed — please update your payment method
                </p>
              )}
            </div>

            <div className="text-right">
              {isPro ? (
                <p className="text-2xl font-bold text-gray-900">
                  $19<span className="text-sm font-normal text-gray-400">/mo</span>
                </p>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  $0<span className="text-sm font-normal text-gray-400">/mo</span>
                </p>
              )}
            </div>
          </div>

          {/* Plan comparison */}
          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <FeatureRow label="Tasks" free="Unlimited" pro="Unlimited" />
              <FeatureRow label="Team members" free="1" pro="Unlimited" />
              <FeatureRow label="Priority support" free="—" pro="✓" highlight />
              <FeatureRow label="Advanced analytics" free="—" pro="✓" highlight />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {!isPro && (
              <button
                onClick={handleUpgrade}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                <FiZap size={15} />
                {actionLoading ? 'Redirecting…' : 'Upgrade to Pro — $19/mo'}
              </button>
            )}
            {isPro && !sub?.cancelAtPeriodEnd && (
              <button
                onClick={handleCancelAtPeriodEnd}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Cancel at period end'}
              </button>
            )}
            {isPro && sub?.cancelAtPeriodEnd && (
              <button
                onClick={handleResumeSubscription}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Resume subscription'}
              </button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Billing details shown in-app (no forced redirect to Stripe portal). */}
      {(sub?.billingEmail || sub?.paymentMethod) && (
        <Card>
          <CardHeader>
            <p className="font-medium text-gray-900">Billing Details</p>
          </CardHeader>
          <CardBody>
            {sub?.paymentMethod ? (
              <p className="text-sm text-gray-700">
                {sub.paymentMethod.brand.toUpperCase()} •••• {sub.paymentMethod.last4}
                {' · '}
                Expires {String(sub.paymentMethod.expMonth).padStart(2, '0')}/{sub.paymentMethod.expYear}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No default payment method found.</p>
            )}
            {sub?.billingEmail && (
              <p className="mt-2 text-sm text-gray-600">Billing email: {sub.billingEmail}</p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <p className="font-medium text-gray-900">Payment History</p>
        </CardHeader>
        <CardBody className="p-0">
          {invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No payments yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {inv.description ?? 'Pro Plan'}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(inv.created)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatAmount(inv.amount, inv.currency)}
                    </span>
                    <InvoiceStatusBadge status={inv.status} />
                    {inv.invoicePdf && (
                      <a
                        href={inv.invoicePdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-violet-600"
                        aria-label="Download invoice"
                      >
                        <FiExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function FeatureRow({
  label,
  free,
  pro,
  highlight,
}: {
  label: string;
  free: string;
  pro: string;
  highlight?: boolean;
}) {
  return (
    <>
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? 'text-violet-600 font-medium' : 'text-gray-700'}>
        <span className="text-gray-400 mr-2">{free}</span>→ {pro}
      </span>
    </>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  if (status === 'paid') return <Badge variant="success">Paid</Badge>;
  if (status === 'open') return <Badge variant="warning">Open</Badge>;
  if (status === 'void' || status === 'uncollectible') return <Badge variant="danger">{status}</Badge>;
  return <Badge variant="default">{status}</Badge>;
}
