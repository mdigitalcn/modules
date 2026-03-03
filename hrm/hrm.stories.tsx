import type { Meta, StoryObj } from "@storybook/react";
import { useClockInOut, useLeaveBalanceSummary, useGoalProgress, useEmployeeFilters } from "./model/hooks";
import { ATTENDANCE_CONFIG, LEAVE_TYPE_CONFIG, SKILL_LEVELS } from "./model/constants";
import type { LeaveBalance as LeaveBalanceType, Goal } from "./model/types";

const mockLeaveBalance: LeaveBalanceType[] = [
  { type: "annual", total: 20, used: 8, remaining: 12 },
  { type: "sick", total: 10, used: 3, remaining: 7 },
  { type: "casual", total: 5, used: 2, remaining: 3 },
  { type: "unpaid", total: 0, used: 0, remaining: 0 },
];

const mockGoals: Goal[] = [
  { id: "g1", employeeId: "e1", title: "Complete React certification", description: "Finish advanced React course", progress: 85, status: "in-progress", dueDate: "2026-03-31" },
  { id: "g2", employeeId: "e1", title: "Onboard 3 team members", description: "Help new hires get up to speed", progress: 100, status: "completed", dueDate: "2026-01-31" },
  { id: "g3", employeeId: "e1", title: "Ship v3.0 release", description: "Complete module restructuring", progress: 60, status: "in-progress", dueDate: "2026-02-28" },
  { id: "g4", employeeId: "e1", title: "Write documentation", description: "API docs for all modules", progress: 10, status: "overdue", dueDate: "2026-01-15" },
];

function ClockInOutDemo() {
  const { isCheckedIn, checkInTime, elapsed, clockIn, clockOut, isLate } = useClockInOut();

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 320 }}>
      <div style={{ padding: 24, background: isCheckedIn ? "#dcfce7" : "#f9fafb", borderRadius: 12, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{isCheckedIn ? "🟢" : "⚪"}</div>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{isCheckedIn ? "Checked In" : "Not Checked In"}</div>
        {checkInTime && <div style={{ fontSize: 13, color: "#6b7280" }}>Since {checkInTime.toLocaleTimeString()}</div>}
        {isLate && <div style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>⚠️ Late check-in</div>}
        {elapsed > 0 && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Worked: {Math.floor(elapsed / 60)}h {elapsed % 60}m</div>}
        <button
          onClick={isCheckedIn ? clockOut : clockIn}
          style={{ marginTop: 16, padding: "10px 24px", background: isCheckedIn ? "#ef4444" : "#22c55e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
        >
          {isCheckedIn ? "Clock Out" : "Clock In"}
        </button>
      </div>
    </div>
  );
}

function LeaveBalanceDemo() {
  const { totalRemaining, totalUsed, totalEntitled, balances } = useLeaveBalanceSummary(mockLeaveBalance);

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 480 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div style={{ padding: 16, background: "#dcfce7", borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Remaining</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalRemaining}</div>
        </div>
        <div style={{ padding: 16, background: "#fef2f2", borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Used</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalUsed}</div>
        </div>
        <div style={{ padding: 16, background: "#f0f9ff", borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Entitled</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalEntitled}</div>
        </div>
      </div>
      {balances.map((b) => {
        const config = LEAVE_TYPE_CONFIG[b.type];
        const pct = b.total > 0 ? (b.used / b.total) * 100 : 0;
        return (
          <div key={b.type} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
              <span style={{ fontWeight: 500 }}>{config.label}</span>
              <span style={{ color: "#6b7280" }}>{b.used}/{b.total} used</span>
            </div>
            <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6", borderRadius: 3 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalProgressDemo() {
  const { completed, overdue, inProgress, total, averageProgress } = useGoalProgress(mockGoals);

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 480 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total", value: total, color: "#f3f4f6" },
          { label: "In Progress", value: inProgress, color: "#dbeafe" },
          { label: "Completed", value: completed, color: "#dcfce7" },
          { label: "Overdue", value: overdue, color: "#fef2f2" },
        ].map((s) => (
          <div key={s.label} style={{ padding: 12, background: s.color, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 20, padding: 12, background: "#f9fafb", borderRadius: 8 }}>
        <div style={{ fontSize: 13, marginBottom: 4 }}>Average Progress: <strong>{averageProgress}%</strong></div>
        <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${averageProgress}%`, background: "#3b82f6", borderRadius: 4 }} />
        </div>
      </div>
      {mockGoals.map((g) => (
        <div key={g.id} style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{g.title}</span>
            <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 8, background: g.status === "completed" ? "#dcfce7" : g.status === "overdue" ? "#fef2f2" : "#dbeafe" }}>{g.status}</span>
          </div>
          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${g.progress}%`, background: g.status === "completed" ? "#22c55e" : g.status === "overdue" ? "#ef4444" : "#3b82f6", borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>Due: {g.dueDate} | {g.progress}%</div>
        </div>
      ))}
    </div>
  );
}

function EmployeeFiltersDemo() {
  const { search, setSearch, department, setDepartment, status, setStatus, params, reset } = useEmployeeFilters();
  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 480 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6, flex: 1, minWidth: 150 }} />
        <select value={department ?? ""} onChange={(e) => setDepartment(e.target.value || null)} style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}>
          <option value="">All Depts</option>
          {["Engineering", "Design", "Marketing", "Sales", "HR"].map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={status ?? ""} onChange={(e) => setStatus(e.target.value || null)} style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}>
          <option value="">All Status</option>
          {["active", "onboarding", "on-leave", "terminated"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={reset} style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", cursor: "pointer" }}>Reset</button>
      </div>
      <pre style={{ marginTop: 12, padding: 12, background: "#f3f4f6", borderRadius: 8, fontSize: 12 }}>API params: {JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}

const meta: Meta = {
  title: "Modules/HRM",
  parameters: { layout: "padded" },
};
export default meta;

export const ClockInOut: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useClockInOut() — Attendance</h3><ClockInOutDemo /></> };
export const LeaveBalance: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useLeaveBalanceSummary()</h3><LeaveBalanceDemo /></> };
export const GoalProgress: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useGoalProgress()</h3><GoalProgressDemo /></> };
export const EmployeeFilters: StoryObj = { render: () => <><h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useEmployeeFilters()</h3><EmployeeFiltersDemo /></> };

export const AttendanceConfig: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Attendance Status Config</h3>
      {Object.entries(ATTENDANCE_CONFIG).map(([key, config]) => (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
          <span style={{ fontWeight: 600, width: 120 }}>{config.label}</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>({config.color})</span>
        </div>
      ))}
    </div>
  ),
};

export const SkillLevels: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Skill Level Scale</h3>
      {SKILL_LEVELS.map((sl) => (
        <div key={sl.level} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ width: 20, height: 8, borderRadius: 2, background: i <= sl.level ? "#3b82f6" : "#e5e7eb" }} />
            ))}
          </div>
          <span style={{ fontWeight: 600 }}>Lv.{sl.level}</span>
          <span style={{ color: "#6b7280" }}>{sl.label}</span>
        </div>
      ))}
    </div>
  ),
};
