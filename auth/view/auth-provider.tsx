"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import type { AuthApi } from "../model/api";
import {
  AuthContext,
  reducer,
  initialState,
  saveAuth,
  loadAuth,
  clearAuth,
  type AuthContextValue,
} from "../model/hooks";
import { TOKEN_REFRESH_BUFFER_MS } from "../model/constants";
import type { AuthTokens, SignInCredentials, SignUpCredentials, User } from "../model/types";

export interface AuthProviderProps {
  children: ReactNode;
  /** Auth API client created with createAuthApi() */
  api: AuthApi;
  /** Auto-refresh tokens before expiry. Default: true */
  autoRefresh?: boolean;
  /** Token refresh buffer in ms. Default: 60_000 */
  refreshBuffer?: number;
  /** Called on auth error */
  onError?: (error: Error) => void;
  /** Called after sign-out */
  onSignOut?: () => void;
}

export function AuthProvider({
  children,
  api,
  autoRefresh = true,
  refreshBuffer = TOKEN_REFRESH_BUFFER_MS,
  onError,
  onSignOut,
}: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  /* ── Schedule refresh ── */
  const scheduleRefresh = useCallback((tokens: AuthTokens) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (!autoRefresh || !tokens.refreshToken || !tokens.expiresAt) return;
    const delay = tokens.expiresAt - Date.now() - refreshBuffer;
    if (delay <= 0) return;
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.refreshToken(tokens.refreshToken!);
        if (!mountedRef.current) return;
        dispatch({ type: "AUTHENTICATED", user: res.user, tokens: res.tokens });
        saveAuth(res.user, res.tokens);
        scheduleRefresh(res.tokens);
      } catch (err) {
        if (!mountedRef.current) return;
        dispatch({ type: "UNAUTHENTICATED" });
        clearAuth();
        onError?.(err instanceof Error ? err : new Error("Token refresh failed"));
      }
    }, delay);
  }, [api, autoRefresh, refreshBuffer, onError]);

  /* ── Hydrate ── */
  useEffect(() => {
    const stored = loadAuth();
    if (stored) {
      if (stored.tokens.expiresAt && stored.tokens.expiresAt < Date.now()) {
        clearAuth();
        dispatch({ type: "UNAUTHENTICATED" });
        return;
      }
      dispatch({ type: "AUTHENTICATED", user: stored.user, tokens: stored.tokens });
      scheduleRefresh(stored.tokens);
    } else {
      dispatch({ type: "UNAUTHENTICATED" });
    }
  }, [scheduleRefresh]);

  /* ── Actions ── */
  const signIn = useCallback(async (credentials: SignInCredentials) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.signIn(credentials);
      if (!mountedRef.current) return;
      dispatch({ type: "AUTHENTICATED", user: res.user, tokens: res.tokens });
      saveAuth(res.user, res.tokens);
      scheduleRefresh(res.tokens);
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err instanceof Error ? err.message : "Sign in failed";
      dispatch({ type: "ERROR", error: msg });
      onError?.(err instanceof Error ? err : new Error(msg));
    }
  }, [api, scheduleRefresh, onError]);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    dispatch({ type: "LOADING" });
    try {
      const res = await api.signUp(credentials);
      if (!mountedRef.current) return;
      dispatch({ type: "AUTHENTICATED", user: res.user, tokens: res.tokens });
      saveAuth(res.user, res.tokens);
      scheduleRefresh(res.tokens);
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err instanceof Error ? err.message : "Sign up failed";
      dispatch({ type: "ERROR", error: msg });
      onError?.(err instanceof Error ? err : new Error(msg));
    }
  }, [api, scheduleRefresh, onError]);

  const signOut = useCallback(async () => {
    dispatch({ type: "LOADING" });
    try { await api.signOut(); } catch {}
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    clearAuth();
    if (mountedRef.current) dispatch({ type: "UNAUTHENTICATED" });
    onSignOut?.();
  }, [api, onSignOut]);

  const refreshSession = useCallback(async () => {
    if (!state.tokens?.refreshToken) return;
    dispatch({ type: "LOADING" });
    try {
      const res = await api.refreshToken(state.tokens.refreshToken);
      if (!mountedRef.current) return;
      dispatch({ type: "AUTHENTICATED", user: res.user, tokens: res.tokens });
      saveAuth(res.user, res.tokens);
      scheduleRefresh(res.tokens);
    } catch (err) {
      if (!mountedRef.current) return;
      dispatch({ type: "UNAUTHENTICATED" });
      clearAuth();
    }
  }, [api, state.tokens, scheduleRefresh]);

  const updateUser = useCallback((updates: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", updates });
  }, []);

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
    updateUser,
    clearError,
    isAuthenticated: state.status === "authenticated",
    isLoading: state.status === "loading" || state.status === "idle",
  }), [state, signIn, signUp, signOut, refreshSession, updateUser, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
