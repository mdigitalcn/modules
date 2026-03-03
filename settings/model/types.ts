export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  timezone: string;
  language: string;
}

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  sms: boolean;
  digest: "none" | "daily" | "weekly";
  categories: Record<string, boolean>;
}

export interface AppearancePrefs {
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
  fontSize: "small" | "medium" | "large";
  sidebar: "expanded" | "collapsed";
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: "authenticator" | "sms" | "email";
  sessionTimeout: number;
  passwordChangedAt?: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly";
  features: string[];
  isCurrent: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: "active" | "invited" | "disabled";
  joinedAt: string;
}

export type SettingsSection = "general" | "profile" | "notifications" | "appearance" | "security" | "billing" | "team";

export interface SettingsConfig {
  baseUrl: string;
  sections?: SettingsSection[];
}
