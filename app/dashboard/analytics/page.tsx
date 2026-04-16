'use client';

import { useEffect, useRef, useState } from 'react';
import { FiUsers, FiPhone, FiCalendar, FiClock } from 'react-icons/fi';
import { toast } from 'sonner';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import { StatCard } from '@/components/ui/Card';
import { PageSpinner } from '@/components/feedback/Spinner';
import { ApiError } from '@/lib/api';

interface Overview {
  leadsTotal: number;
  leadsNew: number;
  leadsQualified: number;
  callsTotal: number;
  meetingsUpcoming: number;
  followupsDue: number;
}

export default function AnalyticsPage() {
  const { isLoading: authLoading } = useAuth();
  const [data, setData] = useState<Overview | null>(null);
  const [requestDone, setRequestDone] = useState(false);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (authLoading || requestedRef.current) return;
    requestedRef.current = true;

    api
      .get<Overview>(API_ROUTES.ANALYTICS_OVERVIEW)
      .then((res) => setData(res.data ?? null))
      .catch(async (err: unknown) => {
        if (err instanceof ApiError && err.status === 403) {
          toast.error('Analytics access is blocked by server configuration');
          return;
        }
        toast.error('Failed to load analytics');
      })
      .finally(() => setRequestDone(true));
  }, [authLoading]);

  if (authLoading) return <PageSpinner />;

  if (!requestDone) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Leads" value={data?.leadsTotal ?? '-'} icon={<FiUsers size={20} />} color="bg-blue-50 text-blue-600" />
        <StatCard label="New Leads (7d)" value={data?.leadsNew ?? '-'} icon={<FiUsers size={20} />} color="bg-violet-50 text-violet-600" />
        <StatCard label="Qualified Leads" value={data?.leadsQualified ?? '-'} icon={<FiUsers size={20} />} color="bg-green-50 text-green-600" />
        <StatCard label="Total Calls" value={data?.callsTotal ?? '-'} icon={<FiPhone size={20} />} color="bg-cyan-50 text-cyan-700" />
        <StatCard label="Upcoming Meetings" value={data?.meetingsUpcoming ?? '-'} icon={<FiCalendar size={20} />} color="bg-yellow-50 text-yellow-700" />
        <StatCard label="Due Follow-ups" value={data?.followupsDue ?? '-'} icon={<FiClock size={20} />} color="bg-red-50 text-red-600" />
      </div>
    </div>
  );
}
