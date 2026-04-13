import type { AuthRoutes } from "./types";

export const AUTH_STORAGE_PREFIX = "mdigitalcn_auth";

export const AUTH_STORAGE_KEYS = {
  tokens: `${AUTH_STORAGE_PREFIX}_tokens`,
  user: `${AUTH_STORAGE_PREFIX}_user`,
  rememberMe: `${AUTH_STORAGE_PREFIX}_remember`,
  lastActivity: `${AUTH_STORAGE_PREFIX}_activity`,
} as const;

export const DEFAULT_AUTH_ROUTES: AuthRoutes = {
  signIn: "/auth/sign-in",
  signUp: "/auth/sign-up",
  signOut: "/auth/sign-out",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  verifyOtp: "/auth/verify-otp",
  refreshToken: "/auth/refresh",
  me: "/auth/me",
};

/** Page routes for navigation */
export const AUTH_PAGES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  twoFactor: "/two-factor",
  dashboard: "/dashboard",
} as const;

export const TOKEN_REFRESH_BUFFER_MS = 60_000;
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const ACTIVITY_CHECK_INTERVAL_MS = 60_000;
