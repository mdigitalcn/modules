"use client";

import { useProtectedRoute } from "../model/hooks";
import type { ReactNode } from "react";

export interface AuthGuardProps {
  children: ReactNode;
  /** What to show while checking auth status */
  loading?: ReactNode;
  /** What to show when unauthorized (or redirect component) */
  fallback?: ReactNode;
  /** Required role */
  requiredRole?: string;
  /** Required permission */
  requiredPermission?: string;
}

/**
 * Protects routes/sections. Only renders children if authenticated
 * and authorized. Shows loading during check, fallback if denied.
 *
 * ```tsx
 * <AuthGuard requiredRole="admin" fallback={<Navigate to="/login" />}>
 *   <AdminDashboard />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  loading = null,
  fallback = null,
  requiredRole,
  requiredPermission,
}: AuthGuardProps) {
  const { authorized, checking } = useProtectedRoute({
    requiredRole,
    requiredPermission,
  });

  if (checking) return <>{loading}</>;
  if (!authorized) return <>{fallback}</>;
  return <>{children}</>;
}
