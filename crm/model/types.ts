export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  avatar?: string;
  status: "active" | "inactive" | "lead" | "customer";
  tags: string[];
  score?: number;
  assignedTo?: string;
  createdAt: string;
  lastContactedAt?: string;
  metadata?: Record<string, unknown>;
}

export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  contactId: string;
  contact?: Contact;
  assignedTo?: string;
  expectedCloseDate?: string;
  closedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export interface PipelineStage {
  id: DealStage;
  name: string;
  color: string;
  deals: Deal[];
  totalValue: number;
}

export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "task" | "deal_update";
  title: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  userId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface LeadScore {
  overall: number;
  breakdown: { category: string; score: number; maxScore: number }[];
}

export interface CrmConfig {
  baseUrl: string;
  currency?: string;
}
