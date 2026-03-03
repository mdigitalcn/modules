import type { DateRange, KPI, ChartSeries, TimelineEvent, StatsResponse } from "./types";

export function createDashboardApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${config.baseUrl}${path}`, window.location.origin);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { headers: { "Content-Type": "application/json", ...config.headers?.() } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  const dateParams = (range: DateRange) => ({ from: range.from.toISOString(), to: range.to.toISOString() });

  return {
    getStats: (range: DateRange) => request<StatsResponse>("/dashboard/stats", dateParams(range)),
    getKPIs: (range: DateRange) => request<KPI[]>("/dashboard/kpis", dateParams(range)),
    getChart: (chartId: string, range: DateRange) => request<ChartSeries[]>(`/dashboard/charts/${chartId}`, dateParams(range)),
    getTimeline: (range: DateRange, cursor?: string) => request<{ events: TimelineEvent[]; nextCursor?: string }>("/dashboard/timeline", { ...dateParams(range), ...(cursor ? { cursor } : {}) }),
  };
}

export type DashboardApi = ReturnType<typeof createDashboardApi>;
