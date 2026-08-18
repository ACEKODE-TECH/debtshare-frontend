import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import { cn } from "@/shared/lib/cn";

const TAB_BASE = cn(
  "flex flex-1 flex-col items-center gap-[3px] py-sm",
  "text-text-secondary transition-colors duration-150",
);

const TAB_ACTIVE = "text-brand-default font-semibold";

export function MobileNav() {
  const { t } = useTranslation();

  return (
    <nav className="flex border-t border-border-divider bg-surface-card lg:hidden">
      <NavLink to="/app/groups" end className={({ isActive }) => cn(TAB_BASE, isActive && TAB_ACTIVE)}>
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
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
