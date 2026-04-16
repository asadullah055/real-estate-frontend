import type { Meeting } from '../types/meeting.types';
import Table from '@/components/ui/Table';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export function MeetingTable({ meetings, loading }: { meetings: Meeting[]; loading?: boolean }) {
  return (
    <Table
      loading={loading}
      emptyMessage="No meetings found."
      keyExtractor={(meeting) => meeting.id}
      data={meetings}
      columns={[
        { header: 'Title', accessor: (meeting) => meeting.title },
        { header: 'Type', accessor: (meeting) => meeting.meetingType },
        {
          header: 'Status',
          accessor: (meeting) => (
            <Badge variant={workflowStatusBadgeVariant(meeting.status)}>
              {meeting.status}
            </Badge>
          ),
        },
        { header: 'Scheduled', accessor: (meeting) => new Date(meeting.scheduledAt).toLocaleString() },
        { header: 'Duration', accessor: (meeting) => `${meeting.durationMinutes}m` },
      ]}
    />
  );
}
