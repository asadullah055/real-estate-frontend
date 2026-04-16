export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  source: string;
  status: string;
  score: number;
  scoreCategory: 'hot' | 'warm' | 'cold' | 'dead';
  assignedAgentId?: string;
  lastContactedAt?: string;
  meetingBookedAt?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}
