export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  cardId: {
    id: string;
    name: string;
    company: string;
    userId: string;
  };
  followUpStatus: "pending" | "contacted" | "completed";
  ipAddress?: string;
  userAgent?: string;
  submittedDate?: string;
}

export interface LeadStats {
  total: number;
  contacted: number;
  pending: number;
  completed: number;
}
