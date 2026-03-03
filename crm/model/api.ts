import type { Contact, Deal, DealStage, Pipeline, Activity } from "./types";

export function createCrmApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...config.headers?.(), ...options?.headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return {
    getContacts: (params?: Record<string, string>) => request<{ items: Contact[]; total: number }>(`/contacts${params ? "?" + new URLSearchParams(params) : ""}`),
    getContact: (id: string) => request<Contact>(`/contacts/${id}`),
    createContact: (data: Partial<Contact>) => request<Contact>("/contacts", { method: "POST", body: JSON.stringify(data) }),
    updateContact: (id: string, data: Partial<Contact>) => request<Contact>(`/contacts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    getDeals: (params?: Record<string, string>) => request<{ items: Deal[]; total: number }>(`/deals${params ? "?" + new URLSearchParams(params) : ""}`),
    getDeal: (id: string) => request<Deal>(`/deals/${id}`),
    createDeal: (data: Partial<Deal>) => request<Deal>("/deals", { method: "POST", body: JSON.stringify(data) }),
    updateDealStage: (id: string, stage: DealStage) => request<Deal>(`/deals/${id}/stage`, { method: "PATCH", body: JSON.stringify({ stage }) }),

    getPipeline: (id?: string) => request<Pipeline>(`/pipeline${id ? `/${id}` : ""}`),
    getActivities: (params?: Record<string, string>) => request<{ items: Activity[]; total: number }>(`/activities${params ? "?" + new URLSearchParams(params) : ""}`),
  };
}

export type CrmApi = ReturnType<typeof createCrmApi>;
