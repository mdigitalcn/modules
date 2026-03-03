import type { SettingsSection } from "./types";

export const SETTINGS_SECTIONS: { id: SettingsSection; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "⚙️" },
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "team", label: "Team", icon: "👥" },
];

export const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata", "Asia/Dhaka",
  "Australia/Sydney", "Pacific/Auckland",
] as const;

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "bn", label: "বাংলা" },
  { code: "ar", label: "العربية" },
] as const;
