import type { Meta, StoryObj } from "@storybook/react";
import { usePipeline, useContactFilters } from "./model/hooks";
import { DEAL_STAGES, CONTACT_STATUSES } from "./model/constants";
import type { Deal, Contact } from "./model/types";

const mockDeals: Deal[] = [
  { id: "1", title: "Enterprise License", value: 45000, currency: "USD", stage: "qualified", probability: 25, contactId: "c1", createdAt: "2025-12-01" },
  { id: "2", title: "SaaS Migration", value: 120000, currency: "USD", stage: "proposal", probability: 50, contactId: "c2", createdAt: "2025-11-15" },
  { id: "3", title: "Support Contract", value: 18000, currency: "USD", stage: "negotiation", probability: 75, contactId: "c3", createdAt: "2025-10-01" },
  { id: "4", title: "Starter Plan", value: 5000, currency: "USD", stage: "won", probability: 100, contactId: "c4", createdAt: "2025-09-15", closedAt: "2025-12-01" },
  { id: "5", title: "Cloud Hosting", value: 32000, currency: "USD", stage: "lead", probability: 10, contactId: "c5", createdAt: "2025-12-20" },
  { id: "6", title: "Lost Deal", value: 8000, currency: "USD", stage: "lost", probability: 0, contactId: "c6", createdAt: "2025-08-01", closedAt: "2025-11-01" },
];

function PipelineDemo() {
  const { stages, totalValue, wonValue } = usePipeline(mockDeals);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 16, background: "#f0f9ff", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Weighted Pipeline</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>${totalValue.toLocaleString()}</div>
        </div>
        <div style={{ padding: 16, background: "#dcfce7", borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Won Revenue</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>${wonValue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
        {stages.map((stage) => (
          <div key={stage.id} style={{ minWidth: 200, background: "#f9fafb", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{stage.name}</span>
              <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto" }}>{stage.deals.length}</span>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>${stage.totalValue.toLocaleString()}</div>
            {stage.deals.map((deal) => (
              <div key={deal.id} style={{ padding: 10, background: "white", borderRadius: 6, marginBottom: 6, border: "1px solid #e5e7eb" }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{deal.title}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>${deal.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FiltersDemo() {
  const { search, setSearch, status, setStatus, tags, setTags, sortBy, setSortBy, params, reset } = useContactFilters();

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 480 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <select value={status ?? ""} onChange={(e) => setStatus(e.target.value || null)} style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6, flex: 1 }}>
            <option value="">All statuses</option>
            {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6, flex: 1 }}>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="createdAt">Sort by Date</option>
          </select>
        </div>
        <button onClick={reset} style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" }}>Reset Filters</button>
      </div>
      <pre style={{ marginTop: 16, padding: 12, background: "#f3f4f6", borderRadius: 8, fontSize: 12 }}>API params: {JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}

const meta: Meta = {
  title: "Modules/CRM",
  parameters: { layout: "padded" },
};
export default meta;

export const Pipeline: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>usePipeline() — Deal Pipeline Board</h3>
      <PipelineDemo />
    </div>
  ),
};

export const ContactFilters: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useContactFilters() — Filter State</h3>
      <FiltersDemo />
    </div>
  ),
};

export const DealStages: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Deal Stage Config</h3>
      {DEAL_STAGES.map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color }} />
          <span style={{ fontWeight: 600, width: 120 }}>{s.name}</span>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{s.probability}% probability</span>
        </div>
      ))}
    </div>
  ),
};
