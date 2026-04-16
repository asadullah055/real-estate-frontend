export interface Meeting {
  id: string;
  leadId: string;
  agentId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  meetingType: string;
  location?: string;
  meetingUrl?: string;
}
