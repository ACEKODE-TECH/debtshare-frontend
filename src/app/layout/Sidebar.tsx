import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { cn } from "@/shared/lib/cn";

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);

const NAV_ITEM =
  "flex items-center gap-[11px] rounded-lg px-md py-sm-plus text-[13.5px] font-medium text-text-secondary transition-colors duration-150";

const NAV_ITEM_IDLE = "hover:bg-surface-subtle hover:text-text-primary";

const NAV_ITEM_ACTIVE = "bg-brand-subtle text-brand-on-subtle font-semibold";

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = useCallback(() => {
    clearAuth();
    navigate("/login");
  }, [clearAuth, navigate]);

  return (
    <aside className="hidden w-[260px] flex-none flex-col border-r border-border-divider bg-surface-card lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-sm-plus px-xl-plus pb-lg pt-xl-plus">
        <div className="flex h-[28px] w-[28px] items-center justify-center rounded-lg bg-brand-default">
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-on-brand)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            <path d="M12 22V12M2 7l10 5 10-5" />
          </svg>
        </div>
        <span className="text-[17px] font-extrabold tracking-[-0.5px] text-text-primary">
          debt<span className="text-brand-default">share</span>
        </span>
      </div>

      {/* Search — opens command palette */}
      <div className="px-lg pb-lg pt-md">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="flex w-full items-center gap-sm-plus rounded-[9px] border border-border-strong bg-surface-subtle px-md py-sm-plus transition-colors duration-150 hover:border-border-stronger hover:bg-surface-hover"
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span className="text-[12.5px] text-text-muted">{t("nav.search")}</span>
          <span className="ml-auto rounded-[4px] border border-border-strong bg-surface-card px-[5px] py-[2px] font-mono text-[10.5px] text-text-muted">
            {IS_MAC ? "⌘K" : "Ctrl+K"}
          </span>
        </button>
      </div>

      {/* Nav */}
      <div className="px-md">
        <div className="mb-sm-plus ml-sm-plus text-[10.5px] font-semibold tracking-[0.8px] text-text-muted">
          {t("nav.menu")}
        </div>
        <nav className="flex flex-col gap-2xs">
          <NavLink
            to="/app/groups"
            className={({ isActive }) => cn(NAV_ITEM, isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
          >
            <svg
              width={17}
              height={17}
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="8" r="3.2" />
              <circle cx="17" cy="10" r="2.4" />
              <path d="M2.5 19c0-3 3-5 6.5-5s6.5 2 6.5 5v1h-13v-1z" />
              <path d="M15.5 15c2.5 0 6 1.5 6 4v1h-5" />
            </svg>
            {t("nav.groups")}
          </NavLink>

          <NavLink
            to="/app/activity"
            className={({ isActive }) => cn(NAV_ITEM, isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
          >
            <svg
              width={17}
              height={17}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            {t("nav.activity")}
          </NavLink>
        </nav>
      </div>

      {/* Profile row */}
      <div className="mt-auto flex items-center gap-sm-plus border-t border-border-divider px-md-plus py-md-plus">
        <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-pill bg-brand-default text-[13px] font-bold text-text-on-brand">
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="truncate text-[13px] font-semibold text-text-primary">{user?.name}</div>
          <div className="truncate text-[11.5px] text-text-muted">{user?.email}</div>
        </div>
        <ThemeToggle className="flex-none" />
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-lg bg-surface-subtle text-text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-text-secondary"
          title={t("nav.logout")}
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
