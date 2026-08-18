import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Command } from "cmdk";

import { useGroups } from "@/features/groups/api/use-groups";
import { useActiveGroupStore } from "@/features/groups/stores/active-group-store";
import { useThemeStore } from "@/shared/stores/theme-store";
import { cn } from "@/shared/lib/cn";

const GROUP_HEADING_STYLES =
  "[&_[cmdk-group-heading]]:mb-xs [&_[cmdk-group-heading]]:px-sm [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.6px] [&_[cmdk-group-heading]]:text-text-muted";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: groups } = useGroups();
  const { setActiveGroup } = useActiveGroupStore();
  const { theme, toggle: toggleTheme } = useThemeStore();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const runAction = useCallback((action: () => void) => {
    action();
    setOpen(false);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={t("commandPalette.placeholder")}
      overlayClassName="fixed inset-0 z-50 bg-surface-canvas/60 backdrop-blur-[2px]"
      contentClassName={cn(
        "fixed left-1/2 top-[min(20vh,140px)] z-50 w-full max-w-[520px] -translate-x-1/2",
        "overflow-hidden rounded-xl border border-border-strong bg-surface-card shadow-lg",
      )}
      loop
    >
      <div className="flex items-center gap-sm border-b border-border-divider px-lg">
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="flex-none text-text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <Command.Input
          placeholder={t("commandPalette.placeholder")}
          className={cn(
            "flex-1 bg-transparent py-md text-[14px] text-text-primary",
            "placeholder:text-text-muted outline-none",
          )}
          autoFocus
        />
        <kbd className="rounded-[4px] border border-border-strong bg-surface-subtle px-[5px] py-[2px] font-mono text-[10.5px] text-text-muted">
          ESC
        </kbd>
      </div>

      <Command.List className="max-h-[320px] overflow-y-auto p-sm">
        <Command.Empty className="px-md py-xl text-center text-[13px] text-text-muted">
          {t("commandPalette.noResults")}
        </Command.Empty>

        {/* Navigation */}
        <Command.Group heading={t("commandPalette.navigation")} className={GROUP_HEADING_STYLES}>
          <CommandItem onSelect={() => runAction(() => navigate("/app/groups"))} icon={<GroupsIcon />}>
            {t("nav.groups")}
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => navigate("/app/activity"))} icon={<ActivityIcon />}>
            {t("nav.activity")}
          </CommandItem>
          <CommandItem onSelect={() => runAction(() => navigate("/app/profile"))} icon={<ProfileIcon />}>
            {t("nav.profile")}
          </CommandItem>
        </Command.Group>

        {/* Groups */}
        {groups && groups.length > 0 && (
          <Command.Group heading={t("commandPalette.groups")} className={cn("mt-sm", GROUP_HEADING_STYLES)}>
            {groups.map((group) => (
              <CommandItem
                key={group.id}
                onSelect={() =>
                  runAction(() => {
                    setActiveGroup(group.id);
                    navigate(`/app/groups/${group.id}`);
                  })
                }
                icon={<span className="text-[13px]">{getGroupEmoji(group.icon)}</span>}
              >
                {group.name}
              </CommandItem>
            ))}
          </Command.Group>
        )}

        {/* Actions */}
        <Command.Group heading={t("commandPalette.actions")} className={cn("mt-sm", GROUP_HEADING_STYLES)}>
          <CommandItem
            onSelect={() => runAction(() => navigate("/app/groups?action=new-expense"))}
            icon={<PlusIcon />}
          >
            {t("commandPalette.newExpense")}
          </CommandItem>
          <CommandItem
            onSelect={() => runAction(toggleTheme)}
            icon={theme === "light" ? <MoonIcon /> : <SunIcon />}
          >
            {theme === "light" ? t("commandPalette.switchDark") : t("commandPalette.switchLight")}
          </CommandItem>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}

function CommandItem({
  children,
  icon,
  onSelect,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-sm-plus rounded-lg px-sm-plus py-sm",
        "text-[13px] text-text-secondary",
        "data-[selected=true]:bg-brand-subtle data-[selected=true]:text-brand-on-subtle",
        "transition-colors duration-100",
      )}
    >
      <span className="flex h-[20px] w-[20px] flex-none items-center justify-center">{icon}</span>
      {children}
    </Command.Item>
  );
}

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

function GroupsIcon() {
  return (
    <svg
      width={15}
      height={15}
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
  );
}

function ActivityIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      width={15}
      height={15}
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
  );
}

function PlusIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
