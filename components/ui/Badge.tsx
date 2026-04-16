type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
  purple:  'bg-violet-100 text-violet-700',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function roleBadgeVariant(role: string): BadgeVariant {
  if (role === 'super-admin') return 'purple';
  if (role === 'admin')       return 'info';
  return 'default';
}

export function statusBadgeVariant(status: string): BadgeVariant {
  if (status === 'active')    return 'success';
  if (status === 'suspended') return 'danger';
  return 'warning';
}

export function workflowStatusBadgeVariant(rawStatus: string): BadgeVariant {
  const status = rawStatus.toLowerCase().trim();

  if ([
    'active',
    'completed',
    'confirmed',
    'converted',
    'sent',
    'ended',
    'available',
    'paid',
  ].includes(status)) {
    return 'success';
  }

  if ([
    'new',
    'contacted',
    'qualified',
    'meeting_scheduled',
    'negotiating',
    'initiated',
    'in_progress',
    'scheduled',
    'under_offer',
    'pending',
    'trialing',
    'past_due',
    'open',
    'incomplete',
    'unread',
  ].includes(status)) {
    return 'warning';
  }

  if ([
    'failed',
    'cancelled',
    'canceled',
    'lost',
    'dead',
    'no_show',
    'off_market',
    'void',
    'uncollectible',
  ].includes(status)) {
    return 'danger';
  }

  if (['sold', 'rented', 'read'].includes(status)) {
    return 'purple';
  }

  return 'default';
}
