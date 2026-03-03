import type { Meta, StoryObj } from "@storybook/react";
import { useDashboardFilters, formatKPIValue } from "./model/hooks";
import { DATE_PRESETS, CHART_COLORS } from "./model/constants";
import type { KPI, ChartSeries, TimelineEvent } from "./model/types";

/* ── Mock Data ── */
const mockKPIs: KPI[] = [
  { id: "1", label: "Revenue", value: 124500, previousValue: 98200, changePercent: 26.8, trend: "up", format: "currency" },
  { id: "2", label: "Users", value: 3842, previousValue: 3210, changePercent: 19.7, trend: "up", format: "number" },
  { id: "3", label: "Conversion", value: 4.2, previousValue: 3.8, changePercent: 10.5, trend: "up", format: "percent" },
  { id: "4", label: "Bounce Rate", value: 32.1, previousValue: 28.4, changePercent: -13.0, trend: "down", format: "percent" },
];

const mockTimeline: TimelineEvent[] = [
  { id: "1", type: "sale", title: "New order #1234", description: "$450 from John Doe", timestamp: new Date(Date.now() - 300000).toISOString(), user: { name: "John Doe" } },
  { id: "2", type: "signup", title: "New user registered", description: "alice@example.com", timestamp: new Date(Date.now() - 900000).toISOString(), user: { name: "Alice" } },
  { id: "3", type: "milestone", title: "1000th order!", description: "Milestone reached", timestamp: new Date(Date.now() - 3600000).toISOString() },
];

/* ── KPI Card Component ── */
function KPICard({ kpi }: { kpi: KPI }) {
  const trendColor = kpi.trend === "up" ? "#22c55e" : kpi.trend === "down" ? "#ef4444" : "#6b7280";
  const arrow = kpi.trend === "up" ? "↑" : kpi.trend === "down" ? "↓" : "→";
  return (
    <div style={{ padding: 20, background: "white", borderRadius: 12, border: "1px solid #e5e7eb", minWidth: 180 }}>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{kpi.label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{formatKPIValue(kpi.value, kpi.format)}</div>
      {kpi.changePercent != null && (
        <div style={{ fontSize: 13, color: trendColor, marginTop: 4 }}>
          {arrow} {Math.abs(kpi.changePercent)}% vs previous
        </div>
      )}
    </div>
  );
}

/* ── Filters Demo ── */
function FilterDemo() {
  const { filters, setPreset, toggleComparison } = useDashboardFilters();
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {DATE_PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPreset(p.value)}
            style={{
              padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer",
              background: filters.preset === p.value ? "#3b82f6" : "white",
              color: filters.preset === p.value ? "white" : "#374151",
              fontWeight: filters.preset === p.value ? 600 : 400,
            }}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={toggleComparison}
          style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer", background: filters.comparison ? "#8b5cf6" : "white", color: filters.comparison ? "white" : "#374151" }}
        >
          {filters.comparison ? "✓ Compare" : "Compare"}
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>
        Range: {filters.dateRange.from.toLocaleDateString()} → {filters.dateRange.to.toLocaleDateString()} | Preset: {filters.preset}
      </div>
    </div>
  );
}

/* ── Stories ── */
const meta: Meta = {
  title: "Modules/Dashboard",
  parameters: { layout: "padded" },
};
export default meta;

export const KPICards: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Dashboard KPIs</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {mockKPIs.map((kpi) => <KPICard key={kpi.id} kpi={kpi} />)}
      </div>
    </div>
  ),
};

export const DateFilters: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Dashboard Filters</h3>
      <FilterDemo />
    </div>
  ),
};

export const Timeline: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui", maxWidth: 480 }}>
      <h3 style={{ marginBottom: 16 }}>Activity Timeline</h3>
      {mockTimeline.map((event) => (
        <div key={event.id} style={{ display: "flex", gap: 12, marginBottom: 16, paddingLeft: 16, borderLeft: "2px solid #e5e7eb" }}>
          <div>
            <div style={{ fontWeight: 600 }}>{event.title}</div>
            {event.description && <div style={{ fontSize: 13, color: "#6b7280" }}>{event.description}</div>}
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{new Date(event.timestamp).toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const FormatValues: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>formatKPIValue()</h3>
      <table style={{ borderCollapse: "collapse" }}>
        <thead><tr style={{ borderBottom: "2px solid #e5e7eb" }}><th style={{ padding: 8, textAlign: "left" }}>Input</th><th style={{ padding: 8, textAlign: "left" }}>Format</th><th style={{ padding: 8, textAlign: "left" }}>Output</th></tr></thead>
        <tbody>
          {[
            [124500, "currency", undefined],
            [3842, "number", undefined],
            [4.2, "percent", undefined],
            [150, undefined, "users"],
            ["N/A", undefined, undefined],
          ].map(([val, fmt, unit], i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td style={{ padding: 8, fontFamily: "monospace" }}>{String(val)}</td>
              <td style={{ padding: 8, fontFamily: "monospace" }}>{fmt ?? "—"}</td>
              <td style={{ padding: 8, fontWeight: 600 }}>{formatKPIValue(val as number | string, fmt as string, unit as string)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const ChartColors: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Chart Color Palette</h3>
      <div style={{ display: "flex", gap: 8 }}>
        {CHART_COLORS.map((color) => (
          <div key={color} style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, background: color, borderRadius: 8, marginBottom: 4 }} />
            <div style={{ fontSize: 11, fontFamily: "monospace" }}>{color}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
