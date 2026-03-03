import type { DealStage } from "./types";

export const DEAL_STAGES: { id: DealStage; name: string; color: string; probability: number }[] = [
  { id: "lead", name: "Lead", color: "#6b7280", probability: 10 },
  { id: "qualified", name: "Qualified", color: "#3b82f6", probability: 25 },
  { id: "proposal", name: "Proposal", color: "#8b5cf6", probability: 50 },
  { id: "negotiation", name: "Negotiation", color: "#f59e0b", probability: 75 },
  { id: "won", name: "Won", color: "#22c55e", probability: 100 },
  { id: "lost", name: "Lost", color: "#ef4444", probability: 0 },
];

export const ACTIVITY_TYPES = ["call", "email", "meeting", "note", "task", "deal_update"] as const;

export const CONTACT_STATUSES = ["active", "inactive", "lead", "customer"] as const;
