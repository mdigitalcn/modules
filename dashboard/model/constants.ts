import type { DatePreset } from "./types";

export const DATE_PRESETS: { value: DatePreset; label: string; days: number }[] = [
  { value: "today", label: "Today", days: 0 },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "12m", label: "Last 12 months", days: 365 },
];

export const DEFAULT_REFRESH_INTERVAL = 60_000;
export const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
