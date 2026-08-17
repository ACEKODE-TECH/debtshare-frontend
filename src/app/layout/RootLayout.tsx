import { Suspense } from "react";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
}
