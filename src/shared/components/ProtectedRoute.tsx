import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ForbiddenView } from "@/shared/components/ForbiddenView";
import type { AppRole } from "@/shared/lib/permissions";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Nếu bỏ trống: chỉ cần đã đăng nhập. */
  allowedRoles?: AppRole[];
  /** Render khi chưa đăng nhập (thường là <LoginPage/>). */
  fallback: ReactNode;
  /** Render khi đủ đăng nhập nhưng sai vai trò. Mặc định <ForbiddenView/>. */
  forbidden?: ReactNode;
}

/**
 * Cổng bảo vệ (không phụ thuộc react-router — app hiện điều hướng bằng state).
 * - loading  → spinner
 * - anon     → fallback
 * - sai role / bị khoá → forbidden
 */
export function ProtectedRoute({ children, allowedRoles, fallback, forbidden }: ProtectedRouteProps) {
  const { status, profile } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary,#2C3481)]" />
      </div>
    );
  }

  if (status === "anon" || !profile) return <>{fallback}</>;

  if (!profile.is_active) {
    return <>{forbidden ?? <ForbiddenView message="Tài khoản của bạn đã bị khoá." />}</>;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <>{forbidden ?? <ForbiddenView />}</>;
  }

  return <>{children}</>;
}
