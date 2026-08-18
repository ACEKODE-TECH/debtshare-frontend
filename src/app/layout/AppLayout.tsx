import { Outlet } from "react-router";

import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="flex h-dvh bg-surface-bg">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <MobileNav />
      </main>
    </div>
  );
}
