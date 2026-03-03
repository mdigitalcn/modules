import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { createAuthApi } from "./model/api";
import { AuthProvider } from "./view/auth-provider";
import { AuthGuard } from "./view/auth-guard";
import { SessionMonitor } from "./view/session-monitor";
import { useAuth } from "./model/hooks";
import { AUTH_PAGES, DEFAULT_AUTH_ROUTES } from "./model/constants";
import type { AuthResponse, User, AuthTokens, SignInCredentials, SignUpCredentials } from "./model/types";

/* ── Mock API ── */
const mockUser: User = { id: "1", name: "Jane Doe", email: "jane@example.com", role: "admin", permissions: ["read", "write", "delete"], emailVerified: true };
const mockTokens: AuthTokens = { accessToken: "mock-access-token", refreshToken: "mock-refresh-token", expiresAt: Date.now() + 3600000 };

function createMockAuthApi() {
  let signedIn = false;
  return createAuthApi({ baseUrl: "https://mock-api.example.com" });
}

// We override fetch for storybook demos
function mockFetch(signedIn: { current: boolean }) {
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input.toString();
    await new Promise((r) => setTimeout(r, 500));

    if (url.includes("/auth/sign-in")) {
      signedIn.current = true;
      return Response.json({ user: mockUser, tokens: mockTokens });
    }
    if (url.includes("/auth/sign-up")) {
      signedIn.current = true;
      return Response.json({ user: { ...mockUser, name: "New User" }, tokens: mockTokens });
    }
    if (url.includes("/auth/sign-out")) {
      signedIn.current = false;
      return Response.json({ message: "Signed out" });
    }
    if (url.includes("/auth/refresh")) {
      return Response.json({ user: mockUser, tokens: { ...mockTokens, expiresAt: Date.now() + 3600000 } });
    }
    if (url.includes("/auth/me")) {
      return signedIn.current ? Response.json(mockUser) : new Response(null, { status: 401 });
    }
    return originalFetch(input, init);
  };
  return () => { window.fetch = originalFetch; };
}

/* ── Auth Status Display ── */
function AuthStatus() {
  const { user, status, error, isAuthenticated, isLoading, signIn, signOut, clearError } = useAuth();
  const [email, setEmail] = useState("jane@example.com");
  const [password, setPassword] = useState("password123");

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 480 }}>
      <div style={{ padding: 16, background: isAuthenticated ? "#dcfce7" : "#fef2f2", borderRadius: 8, marginBottom: 16 }}>
        <strong>Status:</strong> {status}
        {error && <div style={{ color: "#dc2626", marginTop: 4 }}>{error}</div>}
      </div>

      {isAuthenticated && user ? (
        <div>
          <div style={{ padding: 16, background: "#f0f9ff", borderRadius: 8, marginBottom: 16 }}>
            <div><strong>{user.name}</strong></div>
            <div style={{ color: "#6b7280", fontSize: 14 }}>{user.email}</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>Role: {user.role} | Permissions: {user.permissions?.join(", ")}</div>
          </div>
          <button onClick={() => signOut()} style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Sign Out</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }} />
          <button
            onClick={() => signIn({ email, password })}
            disabled={isLoading}
            style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer", opacity: isLoading ? 0.5 : 1 }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Stories ── */
const meta: Meta = {
  title: "Modules/Auth",
  parameters: { layout: "padded" },
};
export default meta;

export const SignInFlow: StoryObj = {
  render: () => {
    const signedIn = { current: false };
    const cleanup = mockFetch(signedIn);
    const api = createAuthApi({ baseUrl: "https://mock-api.example.com" });
    return (
      <AuthProvider api={api} onError={(e) => console.error("Auth error:", e)}>
        <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>Auth Module — Sign In/Out Flow</h3>
        <AuthStatus />
      </AuthProvider>
    );
  },
};

export const ProtectedRoute: StoryObj = {
  render: () => {
    const signedIn = { current: false };
    mockFetch(signedIn);
    const api = createAuthApi({ baseUrl: "https://mock-api.example.com" });
    return (
      <AuthProvider api={api}>
        <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>AuthGuard — Protected Content</h3>
        <AuthStatus />
        <div style={{ marginTop: 16, padding: 16, border: "2px dashed #d1d5db", borderRadius: 8 }}>
          <AuthGuard
            loading={<div style={{ color: "#6b7280" }}>⏳ Checking auth...</div>}
            fallback={<div style={{ color: "#ef4444" }}>🔒 Sign in above to see protected content</div>}
          >
            <div style={{ color: "#22c55e" }}>✅ This content is protected by AuthGuard</div>
          </AuthGuard>
        </div>
        <div style={{ marginTop: 8, padding: 16, border: "2px dashed #d1d5db", borderRadius: 8 }}>
          <AuthGuard
            requiredRole="superadmin"
            loading={<div style={{ color: "#6b7280" }}>⏳ Checking...</div>}
            fallback={<div style={{ color: "#f59e0b" }}>⚠️ Requires &quot;superadmin&quot; role (you are &quot;admin&quot;)</div>}
          >
            <div>Superadmin-only content</div>
          </AuthGuard>
        </div>
      </AuthProvider>
    );
  },
};

export const Constants: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3>Auth Constants</h3>
      <h4>Default API Routes</h4>
      <pre style={{ background: "#f3f4f6", padding: 16, borderRadius: 8, fontSize: 13 }}>
        {JSON.stringify(DEFAULT_AUTH_ROUTES, null, 2)}
      </pre>
      <h4>Page Routes</h4>
      <pre style={{ background: "#f3f4f6", padding: 16, borderRadius: 8, fontSize: 13 }}>
        {JSON.stringify(AUTH_PAGES, null, 2)}
      </pre>
    </div>
  ),
};
