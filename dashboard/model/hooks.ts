"use client";

import { useState, useCallback, useMemo } from "react";
import type { DateRange, DatePreset, DashboardFilters } from "./types";
import { DATE_PRESETS } from "./constants";

function getDateRange(preset: DatePreset): DateRange {
  const to = new Date();
  const from = new Date();
  const config = DATE_PRESETS.find((p) => p.value === preset);
  if (config && config.days > 0) from.setDate(from.getDate() - config.days);
  else from.setHours(0, 0, 0, 0);
  return { from, to };
}

export function useDashboardFilters(defaultPreset: DatePreset = "30d") {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: getDateRange(defaultPreset),
    preset: defaultPreset,
    comparison: false,
  });

  const setPreset = useCallback((preset: DatePreset) => {
    setFilters((prev) => ({ ...prev, preset, dateRange: getDateRange(preset) }));
  }, []);

  const setDateRange = useCallback((range: DateRange) => {
    setFilters((prev) => ({ ...prev, dateRange: range, preset: "custom" }));
  }, []);

  const toggleComparison = useCallback(() => {
    setFilters((prev) => ({ ...prev, comparison: !prev.comparison }));
  }, []);

  return { filters, setPreset, setDateRange, toggleComparison };
}

/** Format KPI value based on format type */
export function formatKPIValue(value: number | string, format?: string, unit?: string): string {
  if (typeof value === "string") return value;
  switch (format) {
    case "currency": return `$${value.toLocaleString()}`;
    case "percent": return `${value.toFixed(1)}%`;
    default: return `${value.toLocaleString()}${unit ? ` ${unit}` : ""}`;
  }
}
