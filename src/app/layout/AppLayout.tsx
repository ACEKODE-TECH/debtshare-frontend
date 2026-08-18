import { Outlet, useLocation } from "react-router";

import { CommandPalette } from "@/shared/components/CommandPalette/CommandPalette";

import { MobileNav } from "./MobileNav";
import { PageTransition } from "./PageTransition";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-dvh bg-surface-bg">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </div>

        <MobileNav />
      </main>

      <CommandPalette />
    </div>
  );
}
