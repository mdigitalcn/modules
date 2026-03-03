import { DEFAULT_AUTH_ROUTES } from "./constants";
import type {
  AuthResponse,
  AuthRoutes,
  MessageResponse,
  OtpPayload,
  ResetPasswordPayload,
  SignInCredentials,
  SignUpCredentials,
  User,
  VerifyEmailPayload,
} from "./types";

/**
 * Auth API client factory.
 *
 * Creates typed API functions for your auth backend.
 * Override `baseUrl` and `routes` to match your API.
 *
 * Usage:
 * ```ts
 * const authApi = createAuthApi({ baseUrl: "/api" });
 * const { user, tokens } = await authApi.signIn({ email, password });
 * ```
 */
export function createAuthApi(config: {
  baseUrl: string;
  routes?: Partial<AuthRoutes>;
  headers?: () => Record<string, string>;
}) {
  const routes = { ...DEFAULT_AUTH_ROUTES, ...config.routes };

  async function request<T>(
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers?.(),
    };

    const res = await fetch(url, {
      ...options,
      headers: { ...headers, ...options?.headers },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }

  return {
    signIn: (credentials: SignInCredentials) =>
      request<AuthResponse>(routes.signIn, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    signUp: (credentials: SignUpCredentials) =>
      request<AuthResponse>(routes.signUp, {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    signOut: () =>
      request<MessageResponse>(routes.signOut, { method: "POST" }),

    forgotPassword: (email: string) =>
      request<MessageResponse>(routes.forgotPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    resetPassword: (payload: ResetPasswordPayload) =>
      request<MessageResponse>(routes.resetPassword, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    verifyEmail: (payload: VerifyEmailPayload) =>
      request<MessageResponse>(routes.verifyEmail, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    verifyOtp: (payload: OtpPayload) =>
      request<AuthResponse>(routes.verifyOtp, {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    refreshToken: (refreshToken: string) =>
      request<AuthResponse>(routes.refreshToken, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),

    getMe: () => request<User>(routes.me, { method: "GET" }),
  };
}

export type AuthApi = ReturnType<typeof createAuthApi>;
