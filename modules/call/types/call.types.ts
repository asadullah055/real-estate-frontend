export interface Call {
  id: string;
  leadId: string;
  retellCallId: string;
  agentId: string;
  direction: 'inbound' | 'outbound' | string;
  status: string;
  fromNumber?: string;
  toNumber?: string;
  durationSeconds?: number;
  transcript?: string;
  recordingUrl?: string;
  createdAt: string;
}
