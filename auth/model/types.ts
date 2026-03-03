/* ── User ── */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  emailVerified?: boolean;
  metadata?: Record<string, unknown>;
}

/* ── Tokens ── */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

/* ── Auth state ── */
export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  status: AuthStatus;
  error: string | null;
}

/* ── Credentials ── */
export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  passwordConfirm: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface OtpPayload {
  code: string;
  method: "authenticator" | "sms" | "email";
}

/* ── API responses ── */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface MessageResponse {
  message: string;
}

/* ── Auth config ── */
export interface AuthConfig {
  /** Base URL for auth API endpoints */
  baseUrl: string;
  /** Route paths */
  routes: AuthRoutes;
  /** Storage key prefix */
  storagePrefix?: string;
  /** Token refresh buffer in ms */
  refreshBuffer?: number;
  /** Session timeout in ms (inactivity) */
  sessionTimeout?: number;
  /** On auth error callback */
  onError?: (error: Error) => void;
  /** On sign out callback */
  onSignOut?: () => void;
}

export interface AuthRoutes {
  signIn: string;
  signUp: string;
  signOut: string;
  forgotPassword: string;
  resetPassword: string;
  verifyEmail: string;
  verifyOtp: string;
  refreshToken: string;
  me: string;
}
