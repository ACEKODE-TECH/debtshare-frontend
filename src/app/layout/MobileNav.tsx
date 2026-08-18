import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import { useUnreadCount } from "@/features/dashboard/api/use-unread-count";
import { cn } from "@/shared/lib/cn";

const TAB_BASE = cn(
  "flex flex-1 flex-col items-center gap-[3px] py-sm",
  "text-text-secondary transition-colors duration-150",
);

const TAB_ACTIVE = "text-brand-default font-semibold";

export function MobileNav() {
  const { t } = useTranslation();
  const { data: unreadCount } = useUnreadCount();

  return (
    <nav className="flex border-t border-border-divider bg-surface-card lg:hidden">
      <NavLink to="/app" end className={({ isActive }) => cn(TAB_BASE, isActive && TAB_ACTIVE)}>
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "flex h-[32px] w-[64px] items-center justify-center rounded-pill",
                isActive && "bg-brand-subtle",
              )}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z" />
              </svg>
            </div>
            <span className="text-[11px]">{t("nav.home")}</span>
          </>
        )}
      </NavLink>

      <NavLink to="/app/groups" className={({ isActive }) => cn(TAB_BASE, isActive && TAB_ACTIVE)}>
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "flex h-[32px] w-[64px] items-center justify-center rounded-pill",
                isActive && "bg-brand-subtle",
              )}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="8" r="3.2" />
                <circle cx="17" cy="10" r="2.4" />
                <path d="M2.5 19c0-3 3-5 6.5-5s6.5 2 6.5 5v1h-13v-1z" />
                <path d="M15.5 15c2.5 0 6 1.5 6 4v1h-5" />
              </svg>
            </div>
            <span className="text-[11px]">{t("nav.groups")}</span>
          </>
        )}
      </NavLink>

      <NavLink to="/app/activity" className={({ isActive }) => cn(TAB_BASE, isActive && TAB_ACTIVE)}>
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "relative flex h-[32px] w-[64px] items-center justify-center rounded-pill",
                isActive && "bg-brand-subtle",
              )}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {!!unreadCount && unreadCount > 0 && (
                <div className="absolute right-[14px] top-[2px] h-[8px] w-[8px] rounded-pill border-2 border-surface-card bg-brand-default" />
              )}
            </div>
            <span className="text-[11px]">{t("nav.activity")}</span>
          </>
        )}
      </NavLink>

      <NavLink to="/app/profile" className={({ isActive }) => cn(TAB_BASE, isActive && TAB_ACTIVE)}>
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "flex h-[32px] w-[64px] items-center justify-center rounded-pill",
                isActive && "bg-brand-subtle",
              )}
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>
            <span className="text-[11px]">{t("nav.profile")}</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
