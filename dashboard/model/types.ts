export interface KPI {
  id: string;
  label: string;
  value: number | string;
  previousValue?: number | string;
  changePercent?: number;
  trend?: "up" | "down" | "flat";
  icon?: string;
  unit?: string;
  format?: "number" | "currency" | "percent";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: unknown;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  user?: { name: string; avatar?: string };
  metadata?: Record<string, unknown>;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export type DatePreset = "today" | "7d" | "30d" | "90d" | "12m" | "custom";

export interface DashboardFilters {
  dateRange: DateRange;
  preset: DatePreset;
  comparison?: boolean;
}

export interface StatsResponse {
  kpis: KPI[];
  charts: Record<string, ChartSeries[]>;
  timeline: TimelineEvent[];
  updatedAt: string;
}

export interface DashboardConfig {
  baseUrl: string;
  refreshInterval?: number;
  defaultPreset?: DatePreset;
}
