import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { cn } from "@/shared/lib/cn";
import type { GroupSummary } from "@/types";

import { getGroupEmoji, getGroupIconTint } from "../lib/group-icons";
import { useActiveGroupStore } from "../stores/active-group-store";

export type GroupSwitcherProps = {
  currentGroupId: string;
  groups: GroupSummary[];
  trigger?: ReactNode;
};

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Inline group switcher. Renders `trigger` (defaults to a small chevron button)
 * and opens a dropdown listing all my groups. The current group is highlighted.
 */
export function GroupSwitcher({ currentGroupId, groups, trigger }: GroupSwitcherProps) {
  const { t } = useTranslation("groups");
  const navigate = useNavigate();
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = groups.find((g) => g.id === currentGroupId);
  const others = groups.filter((g) => g.id !== currentGroupId);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (!current) return null;

  return (
    <div className="relative" ref={rootRef}>
      {trigger ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t("detail.switcher.changeAria")}
          className={cn(
            "group inline-flex max-w-full items-center rounded-lg -mx-sm px-sm py-xs text-left transition-colors duration-150",
            "hover:bg-surface-subtle",
            open && "bg-surface-subtle",
          )}
        >
          {trigger}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t("detail.switcher.changeAria")}
          className={cn(
            "inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl border transition-colors duration-150",
            open
              ? "border-brand-default bg-brand-subtle text-brand-on-subtle"
              : "border-border-strong bg-surface-subtle text-text-secondary hover:border-border-stronger hover:bg-surface-hover hover:text-text-primary",
          )}
        >
          <ChevronDownIcon open={open} />
        </button>
      )}

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 top-full z-30 mt-xs min-w-[300px] rounded-2xl",
            "border border-border-strong bg-surface-card p-xs shadow-lg",
          )}
        >
          <button
            type="button"
            role="option"
            aria-selected="true"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-sm rounded-xl bg-brand-subtle px-sm-plus py-sm text-left"
          >
            <GroupTile group={current} />
            <span className="flex-1 truncate text-md font-bold text-brand-on-subtle">{current.name}</span>
            <span className="text-brand-on-subtle">
              <CheckIcon />
            </span>
          </button>

          {others.length > 0 && (
            <div className="mt-2xs space-y-2xs border-t border-border-divider pt-2xs">
              {others.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => {
                    setActiveGroup(g.id);
                    setOpen(false);
                    navigate(`/app/groups/${g.id}`);
                  }}
                  className="flex w-full items-center gap-sm rounded-xl px-sm-plus py-sm text-left transition-colors duration-100 hover:bg-surface-subtle"
                >
                  <GroupTile group={g} />
                  <span className="flex-1 truncate text-md font-semibold text-text-primary">{g.name}</span>
                  <span className="text-[11px] font-bold text-text-muted">{g.currency}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("/app/groups");
            }}
            className="mt-2xs flex w-full items-center gap-sm rounded-xl border-t border-border-divider px-sm-plus py-sm-plus text-[12.5px] font-bold text-brand-default hover:bg-surface-subtle"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("detail.switcher.backToList")}
          </button>
        </div>
      )}
    </div>
  );
}

function GroupTile({ group }: { group: GroupSummary }) {
  const tint = getGroupIconTint(group.icon);
  return (
    <span
      className={cn(
        "flex h-[32px] w-[32px] flex-none items-center justify-center rounded-lg text-md",
        tint.bg,
        tint.fg,
      )}
      aria-hidden
    >
      {getGroupEmoji(group.icon)}
    </span>
  );
}
