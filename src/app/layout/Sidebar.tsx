import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router";

import { useUnreadCount } from "@/features/dashboard/api/use-unread-count";
import { useGroups } from "@/features/groups/api/use-groups";
import { useActiveGroupStore } from "@/features/groups/stores/active-group-store";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { cn } from "@/shared/lib/cn";

const GROUP_ICON_MAP: Record<string, string> = {
  flight: "✈️",
  home: "🏠",
  food: "🍽️",
  party: "🎉",
  sports: "⚽",
  default: "👥",
};

function getGroupEmoji(icon: string): string {
  return GROUP_ICON_MAP[icon] || GROUP_ICON_MAP.default;
}

const NAV_ITEM = cn(
  "flex items-center gap-[11px] rounded-lg px-md py-sm-plus text-[13.5px] font-medium",
  "text-text-secondary transition-colors duration-150",
  "hover:bg-surface-subtle hover:text-text-primary",
);

const NAV_ITEM_ACTIVE = "bg-brand-subtle text-brand-default font-semibold";

export function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { data: groups } = useGroups();
  const { data: unreadCount } = useUnreadCount();
  const { activeGroupId, setActiveGroup } = useActiveGroupStore();

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (groups?.length && !activeGroupId) {
      setActiveGroup(groups[0].id);
    }
  }, [groups, activeGroupId, setActiveGroup]);

  const activeGroup = groups?.find((g) => g.id === activeGroupId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* Group switcher */}
      <div className="relative px-lg pb-lg" ref={switcherRef}>
        <button
          type="button"
          onClick={() => setSwitcherOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-sm-plus rounded-[10px] border px-md py-sm-plus transition-all duration-200",
            switcherOpen
              ? "border-brand-default bg-brand-subtle shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]"
              : "border-border-strong bg-surface-subtle hover:border-border-stronger",
          )}
        >
          {activeGroup ? (
            <>
              <span className="flex h-[28px] w-[28px] flex-none items-center justify-center rounded-lg bg-surface-bg text-sm">
                {getGroupEmoji(activeGroup.icon)}
              </span>
              <div className="flex-1 text-left">
                <div className="truncate text-[13px] font-semibold text-text-primary">{activeGroup.name}</div>
              </div>
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                className={cn(
                  "flex-none text-text-muted transition-transform duration-200",
                  switcherOpen && "rotate-180",
                )}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </>
          ) : (
            <span className="text-[13px] text-text-muted">{t("nav.noGroups")}</span>
          )}
        </button>

        {/* Dropdown */}
        {switcherOpen && groups && groups.length > 0 && (
          <div className="absolute left-lg right-lg z-10 mt-xs rounded-[10px] border border-border-strong bg-surface-card p-xs shadow-lg">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  setActiveGroup(group.id);
                  setSwitcherOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-sm-plus rounded-lg px-sm-plus py-sm text-left transition-colors duration-150",
                  group.id === activeGroupId
                    ? "bg-brand-subtle text-brand-default"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
                )}
              >
                <span className="flex h-[24px] w-[24px] flex-none items-center justify-center rounded-md bg-surface-bg text-xs">
                  {getGroupEmoji(group.icon)}
                </span>
                <span className="truncate text-[13px] font-medium">{group.name}</span>
                {group.id === activeGroupId && (
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    className="ml-auto flex-none"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-lg pb-lg">
        <div className="flex items-center gap-sm-plus rounded-[9px] border border-border-strong bg-surface-subtle px-md py-sm-plus">
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
            ⌘K
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="px-md">
        <div className="mb-sm-plus ml-sm-plus text-[10.5px] font-semibold tracking-[0.8px] text-text-muted">
          {t("nav.menu")}
        </div>
        <nav className="flex flex-col gap-2xs">
          <NavLink to="/app" end className={({ isActive }) => cn(NAV_ITEM, isActive && NAV_ITEM_ACTIVE)}>
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
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z" />
            </svg>
            {t("nav.dashboard")}
          </NavLink>

          <NavLink to="/app/groups" className={({ isActive }) => cn(NAV_ITEM, isActive && NAV_ITEM_ACTIVE)}>
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

          <NavLink to="/app/activity" className={({ isActive }) => cn(NAV_ITEM, isActive && NAV_ITEM_ACTIVE)}>
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
            {!!unreadCount && unreadCount > 0 && (
              <span className="ml-auto rounded-pill bg-brand-subtle px-[7px] py-[2px] text-[10px] font-bold text-brand-default">
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/app/history" className={({ isActive }) => cn(NAV_ITEM, isActive && NAV_ITEM_ACTIVE)}>
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
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 4v4M16 4v4" />
            </svg>
            {t("nav.history")}
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
