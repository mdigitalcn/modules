export const MESSAGE_PAGE_SIZE = 50;
export const TYPING_TIMEOUT_MS = 3_000;
export const RECONNECT_DELAY_MS = 5_000;
export const MAX_RECONNECT_ATTEMPTS = 10;

export const MESSAGE_STATUS_LABELS: Record<string, string> = {
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
};

export const PRESENCE_CONFIG: Record<string, { label: string; color: string }> = {
  online: { label: "Online", color: "#22c55e" },
  away: { label: "Away", color: "#f59e0b" },
  busy: { label: "Busy", color: "#ef4444" },
  offline: { label: "Offline", color: "#6b7280" },
};
