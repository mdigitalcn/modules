import type { Meta, StoryObj } from "@storybook/react";
import { useSettingsNav, useUnsavedChanges, useAppearance } from "./model/hooks";
import { SETTINGS_SECTIONS, TIMEZONES, LANGUAGES } from "./model/constants";
import type { AppearancePrefs } from "./model/types";

function SettingsNavDemo() {
  const { activeSection, setActiveSection, sections } = useSettingsNav();

  return (
    <div style={{ fontFamily: "system-ui", display: "flex", gap: 24, maxWidth: 600 }}>
      <div style={{ width: 180 }}>
        {sections.map((s) => (
          <div
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: "10px 14px", cursor: "pointer", borderRadius: 8, marginBottom: 2,
              background: activeSection === s.id ? "#eff6ff" : "transparent",
              color: activeSection === s.id ? "#3b82f6" : "#374151",
              fontWeight: activeSection === s.id ? 600 : 400,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <span>{s.icon}</span> {s.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 24, background: "#f9fafb", borderRadius: 8 }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>{sections.find((s) => s.id === activeSection)?.icon} {sections.find((s) => s.id === activeSection)?.label}</h3>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Content for the <strong>{activeSection}</strong> section goes here.</p>
      </div>
    </div>
  );
}

function UnsavedChangesDemo() {
  const initial = { name: "Jane Doe", email: "jane@example.com", timezone: "America/New_York" };
  const { current, updateField, reset, markSaved, isDirty } = useUnsavedChanges(initial);

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Name
          <input value={current.name} onChange={(e) => updateField("name", e.target.value)} style={{ display: "block", width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6, marginTop: 4, boxSizing: "border-box" }} />
        </label>
        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Email
          <input value={current.email} onChange={(e) => updateField("email", e.target.value)} style={{ display: "block", width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6, marginTop: 4, boxSizing: "border-box" }} />
        </label>
        <label style={{ fontSize: 14, fontWeight: 500 }}>
          Timezone
          <select value={current.timezone} onChange={(e) => updateField("timezone", e.target.value)} style={{ display: "block", width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6, marginTop: 4 }}>
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: isDirty ? "#fef3c7" : "#dcfce7" }}>
        {isDirty ? "⚠️ You have unsaved changes" : "✅ All changes saved"}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={markSaved} disabled={!isDirty} style={{ padding: "8px 16px", background: isDirty ? "#3b82f6" : "#d1d5db", color: "white", border: "none", borderRadius: 6, cursor: isDirty ? "pointer" : "default" }}>Save</button>
        <button onClick={reset} disabled={!isDirty} style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", cursor: isDirty ? "pointer" : "default", opacity: isDirty ? 1 : 0.5 }}>Discard</button>
      </div>
    </div>
  );
}

function AppearanceDemo() {
  const { resolvedTheme, ...prefs } = useAppearance({ theme: "system", density: "comfortable", fontSize: "medium", sidebar: "expanded" });

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400 }}>
      <div style={{ padding: 16, background: "#f9fafb", borderRadius: 8 }}>
        <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Theme:</strong> {prefs.theme} → resolved: <strong>{resolvedTheme}</strong></div>
        <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Density:</strong> {prefs.density}</div>
        <div style={{ fontSize: 14, marginBottom: 8 }}><strong>Font size:</strong> {prefs.fontSize}</div>
        <div style={{ fontSize: 14 }}><strong>Sidebar:</strong> {prefs.sidebar}</div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Modules/Settings",
  parameters: { layout: "padded" },
};
export default meta;

export const Navigation: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useSettingsNav() — Section Navigation</h3>
      <SettingsNavDemo />
    </div>
  ),
};

export const UnsavedChanges: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useUnsavedChanges() — Dirty Tracking</h3>
      <UnsavedChangesDemo />
    </div>
  ),
};

export const Appearance: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useAppearance() — Theme Resolution</h3>
      <AppearanceDemo />
    </div>
  ),
};

export const AvailableLanguages: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>Available Languages</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {LANGUAGES.map((lang) => (
          <div key={lang.code} style={{ padding: "8px 14px", background: "#f3f4f6", borderRadius: 8, fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>{lang.label}</span> <span style={{ color: "#9ca3af" }}>({lang.code})</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
