import { Navigate, Outlet, useLocation } from "react-router";

import { useAuthStore } from "@/features/auth/stores/auth-store";

export function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const returnTo = location.pathname + location.search;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <Outlet />;
}

export function RequireGuest() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get("returnTo") || "/app";
    return <Navigate to={returnTo} replace />;
  }

  return <Outlet />;
}
