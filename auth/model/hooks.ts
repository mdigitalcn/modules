"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  AUTH_STORAGE_KEYS,
  TOKEN_REFRESH_BUFFER_MS,
  SESSION_TIMEOUT_MS,
  ACTIVITY_CHECK_INTERVAL_MS,
} from "./constants";
import type {
  AuthState,
  AuthTokens,
  SignInCredentials,
  SignUpCredentials,
  User,
} from "./types";

/* ── Context value ── */
export interface AuthContextValue extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ── Reducer ── */
type Action =
  | { type: "LOADING" }
  | { type: "AUTHENTICATED"; user: User; tokens: AuthTokens }
  | { type: "UNAUTHENTICATED" }
  | { type: "ERROR"; error: string }
  | { type: "UPDATE_USER"; updates: Partial<User> }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  tokens: null,
  status: "idle",
  error: null,
};

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOADING":
      return { ...state, status: "loading", error: null };
    case "AUTHENTICATED":
      return { user: action.user, tokens: action.tokens, status: "authenticated", error: null };
    case "UNAUTHENTICATED":
      return { ...initialState, status: "unauthenticated" };
    case "ERROR":
      return { ...state, status: "unauthenticated", error: action.error };
    case "UPDATE_USER":
      return state.user ? { ...state, user: { ...state.user, ...action.updates } } : state;
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

/* ── Storage ── */
function saveAuth(user: User, tokens: AuthTokens): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
    localStorage.setItem(AUTH_STORAGE_KEYS.tokens, JSON.stringify(tokens));
  } catch {}
}

function loadAuth(): { user: User; tokens: AuthTokens } | null {
  try {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(AUTH_STORAGE_KEYS.user);
    const tokens = localStorage.getItem(AUTH_STORAGE_KEYS.tokens);
    if (!user || !tokens) return null;
    return { user: JSON.parse(user), tokens: JSON.parse(tokens) };
  } catch {
    return null;
  }
}

function clearAuth(): void {
  try {
    Object.values(AUTH_STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {}
}

/* ── Context ── */
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/* ── Session activity hook ── */
export function useSessionMonitor(options: {
  timeout?: number;
  onTimeout: () => void;
  enabled?: boolean;
}) {
  const { timeout = SESSION_TIMEOUT_MS, onTimeout, enabled = true } = options;
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, updateActivity, { passive: true }));

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > timeout) {
        onTimeout();
      }
    }, ACTIVITY_CHECK_INTERVAL_MS);

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [timeout, onTimeout, enabled]);
}

/* ── Protected route hook ── */
export function useProtectedRoute(options?: {
  redirectTo?: string;
  requiredRole?: string;
  requiredPermission?: string;
}): { authorized: boolean; checking: boolean } {
  const { user, status } = useAuth();
  const checking = status === "idle" || status === "loading";

  if (checking) return { authorized: false, checking: true };
  if (!user) return { authorized: false, checking: false };

  if (options?.requiredRole && user.role !== options.requiredRole) {
    return { authorized: false, checking: false };
  }

  if (options?.requiredPermission && !user.permissions?.includes(options.requiredPermission)) {
    return { authorized: false, checking: false };
  }

  return { authorized: true, checking: false };
}

export { AuthContext, reducer, initialState, saveAuth, loadAuth, clearAuth };
export type { Action };
