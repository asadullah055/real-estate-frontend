'use client';

import { FiMail, FiUser, FiShield, FiCalendar } from 'react-icons/fi';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Badge, { roleBadgeVariant, statusBadgeVariant } from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { PageSpinner } from '@/components/feedback/Spinner';
import { formatDate } from '@/lib/formatters';

export default function ProfilePage() {
  const { profile, isLoading } = useAuth();

  if (isLoading) return <PageSpinner />;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <Card>
        <CardBody className="flex items-center gap-5">
          <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={roleBadgeVariant(profile.role)}>{profile.role}</Badge>
              <Badge variant={statusBadgeVariant(profile.status)}>{profile.status}</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-gray-900">Account Details</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Row icon={<FiUser size={15} />} label="Full Name" value={profile.name} />
          <Row icon={<FiMail size={15} />} label="Email" value={profile.email} />
          <Row icon={<FiShield size={15} />} label="Role" value={profile.role} />
          <Row
            icon={<FiCalendar size={15} />}
            label="Member Since"
            value={formatDate(profile.createdAt)}
          />
        </CardBody>
      </Card>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
