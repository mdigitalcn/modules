"use client";

import { useCallback } from "react";
import { useAuth, useSessionMonitor } from "../model/hooks";
import type { ReactNode } from "react";

export interface SessionMonitorProps {
  children: ReactNode;
  /** Session timeout in ms. Default: 30 minutes */
  timeout?: number;
  /** Whether session monitoring is active. Default: true when authenticated */
  enabled?: boolean;
  /** Custom callback on session timeout (default: sign out) */
  onTimeout?: () => void;
}

/**
 * Monitors user activity and auto-signs out after inactivity.
 * Wrap your authenticated app section with this.
 *
 * ```tsx
 * <SessionMonitor timeout={15 * 60 * 1000}>
 *   <DashboardLayout />
 * </SessionMonitor>
 * ```
 */
export function SessionMonitor({
  children,
  timeout,
  enabled,
  onTimeout,
}: SessionMonitorProps) {
  const { signOut, isAuthenticated } = useAuth();

  const handleTimeout = useCallback(() => {
    if (onTimeout) {
      onTimeout();
    } else {
      signOut();
    }
  }, [onTimeout, signOut]);

  useSessionMonitor({
    timeout,
    onTimeout: handleTimeout,
    enabled: enabled ?? isAuthenticated,
  });

  return <>{children}</>;
}
