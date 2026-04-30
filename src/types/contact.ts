export interface Contact {
  id: string;
  userId: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  linkedin?: string;
  lastContacted?: string;
  nextFollowup?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
