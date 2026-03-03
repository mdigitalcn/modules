import type { Profile, NotificationPrefs, AppearancePrefs, SecuritySettings, BillingPlan, TeamMember } from "./types";

export function createSettingsApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers: { "Content-Type": "application/json", ...config.headers?.(), ...options?.headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return {
    // Profile
    getProfile: () => request<Profile>("/settings/profile"),
    updateProfile: (data: Partial<Profile>) => request<Profile>("/settings/profile", { method: "PATCH", body: JSON.stringify(data) }),
    uploadAvatar: async (file: File) => { const fd = new FormData(); fd.append("avatar", file); const res = await fetch(`${config.baseUrl}/settings/profile/avatar`, { method: "POST", body: fd, headers: config.headers?.() }); if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() as Promise<{ url: string }>; },

    // Notifications
    getNotificationPrefs: () => request<NotificationPrefs>("/settings/notifications"),
    updateNotificationPrefs: (data: Partial<NotificationPrefs>) => request<NotificationPrefs>("/settings/notifications", { method: "PATCH", body: JSON.stringify(data) }),

    // Appearance
    getAppearancePrefs: () => request<AppearancePrefs>("/settings/appearance"),
    updateAppearancePrefs: (data: Partial<AppearancePrefs>) => request<AppearancePrefs>("/settings/appearance", { method: "PATCH", body: JSON.stringify(data) }),

    // Security
    getSecuritySettings: () => request<SecuritySettings>("/settings/security"),
    changePassword: (current: string, newPassword: string) => request<void>("/settings/security/password", { method: "POST", body: JSON.stringify({ current, newPassword }) }),
    enableTwoFactor: (method: string) => request<{ secret: string; qrCode: string }>("/settings/security/2fa/enable", { method: "POST", body: JSON.stringify({ method }) }),
    disableTwoFactor: () => request<void>("/settings/security/2fa/disable", { method: "POST" }),

    // Billing
    getBillingPlans: () => request<BillingPlan[]>("/settings/billing/plans"),
    changePlan: (planId: string) => request<void>("/settings/billing/plans", { method: "POST", body: JSON.stringify({ planId }) }),

    // Team
    getTeamMembers: () => request<TeamMember[]>("/settings/team"),
    inviteMember: (email: string, role: string) => request<TeamMember>("/settings/team/invite", { method: "POST", body: JSON.stringify({ email, role }) }),
    updateMemberRole: (memberId: string, role: string) => request<TeamMember>(`/settings/team/${memberId}`, { method: "PATCH", body: JSON.stringify({ role }) }),
    removeMember: (memberId: string) => request<void>(`/settings/team/${memberId}`, { method: "DELETE" }),
  };
}

export type SettingsApi = ReturnType<typeof createSettingsApi>;
