import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

import { EmptyState } from "@/shared/components/ui";
import { cn } from "@/shared/lib/cn";
import type { GroupSummary } from "@/types";

import { useGroups } from "../api/use-groups";
import { CreateGroupModal } from "../components/CreateGroupModal";
import { GroupCard } from "../components/GroupCard";
import { formatAmount } from "../lib/format";
import { useActiveGroupStore } from "../stores/active-group-store";

function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GroupsEmptyIllustration() {
  return (
    <div className="relative mb-2xl h-[180px] w-[220px]" aria-hidden>
      <div className="absolute left-[30px] top-[20px] h-[70px] w-[70px] rounded-pill bg-brand-subtle opacity-90" />
      <div className="absolute bottom-[10px] right-[20px] h-[90px] w-[90px] rounded-pill bg-accent-mustard-subtle opacity-70" />
      <div className="absolute right-[60px] top-[60px] h-[50px] w-[50px] rounded-pill bg-accent-plum-subtle opacity-80" />
      <div className="absolute left-1/2 top-[38px] w-[130px] -translate-x-1/2 -rotate-6 rounded-[14px] border border-border-divider bg-surface-card p-md shadow-lg">
        <div className="mb-sm flex items-center gap-xs">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-brand-subtle text-brand-default">
            ✈️
          </div>
          <div className="text-[10px] font-bold text-text-primary">Viaje a Lisboa</div>
        </div>
        <div className="mb-2xs h-[5px] rounded-[3px] bg-surface-subtle" />
        <div className="h-[5px] w-[70%] rounded-[3px] bg-surface-subtle" />
      </div>
      <div className="absolute bottom-0 right-[50px] flex h-[44px] w-[44px] rotate-[8deg] items-center justify-center rounded-[14px] bg-brand-default shadow-lg">
        <PlusIcon className="text-text-on-brand" />
      </div>
    </div>
  );
}

function GroupCardSkeleton() {
  return (
    <div className="flex min-h-[220px] flex-col gap-md rounded-[14px] border border-border-divider bg-surface-card p-lg-plus">
      <div className="flex items-start justify-between">
        <div className="h-[48px] w-[48px] animate-pulse rounded-[14px] bg-surface-subtle" />
        <div className="h-[18px] w-[54px] animate-pulse rounded-md bg-surface-subtle" />
      </div>
      <div className="h-[18px] w-2/3 animate-pulse rounded bg-surface-subtle" />
      <div className="h-[14px] w-1/2 animate-pulse rounded bg-surface-subtle" />
      <div className="mt-auto flex items-end justify-between border-t border-border-divider pt-md-plus">
        <div className="space-y-xs">
          <div className="h-[10px] w-[60px] animate-pulse rounded bg-surface-subtle" />
          <div className="h-[20px] w-[90px] animate-pulse rounded bg-surface-subtle" />
        </div>
        <div className="h-[10px] w-[40px] animate-pulse rounded bg-surface-subtle" />
      </div>
    </div>
  );
}

function CreateGroupCard({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation("groups");
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-[220px] flex-col items-center justify-center gap-sm rounded-[14px]",
        "border border-dashed border-border-strong bg-transparent p-lg-plus text-center",
        "transition-all duration-150",
        "hover:border-brand-default hover:bg-brand-subtle/30",
        "focus:outline-none focus-visible:border-brand-default focus-visible:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
      )}
    >
      <span className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] bg-brand-subtle text-brand-default transition-transform duration-150 group-hover:scale-105">
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <div className="text-[14px] font-bold text-text-primary">{t("listing.createCard.title")}</div>
        <p className="mx-auto mt-2xs max-w-[220px] text-[12px] leading-relaxed text-text-tertiary">
          {t("listing.createCard.description")}
        </p>
      </div>
    </button>
  );
}

function computeGlobalBalance(groups: GroupSummary[]): { total: number; currency: string | null } {
  const byCurrency = new Map<string, number>();
  for (const g of groups) {
    byCurrency.set(g.currency, (byCurrency.get(g.currency) ?? 0) + g.myBalance);
  }
  if (byCurrency.size === 0) return { total: 0, currency: null };
  // Pick the currency with most groups if mixed; UI is placeholder for multi-currency (DEB-106)
  const [firstCurrency, firstTotal] = Array.from(byCurrency.entries())[0];
  return { total: Math.round(firstTotal * 100) / 100, currency: firstCurrency };
}

type StatusFilter = "all" | "active" | "settled";

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-xs rounded-lg border px-md py-sm text-[12.5px] font-semibold transition-all duration-150",
        active
          ? "border-transparent bg-text-primary text-surface-card"
          : "border-border-strong bg-surface-card text-text-secondary hover:border-border-stronger hover:text-text-primary",
      )}
    >
      {children}
      <span
        className={cn(
          "rounded-md px-xs text-[10.5px] font-bold tabular-nums",
          active ? "bg-surface-card/25 text-surface-card" : "bg-surface-subtle text-text-muted",
        )}
      >
        {count}
      </span>
    </button>
  );
}

export function GroupsPage() {
  const { t } = useTranslation("groups");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: groups, isPending, isError, refetch, isRefetching } = useGroups();
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);

  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Opens the modal when arriving with `?action=new-group` (fresh or already on the page,
  // e.g. from the command palette). Consumes the param so a reload doesn't reopen it.
  useEffect(() => {
    if (searchParams.get("action") === "new-group") {
      const next = new URLSearchParams(searchParams);
      next.delete("action");
      setSearchParams(next, { replace: true });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- state derived from URL param that we then consume
      setModalOpen(true);
    }
  }, [searchParams, setSearchParams]);

  const handleCreated = (groupId: string) => {
    setActiveGroup(groupId);
    navigate(`/app/groups/${groupId}`);
  };

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    const q = query.trim().toLowerCase();
    return groups.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q)) return false;
      if (statusFilter === "active" && g.status !== "active") return false;
      if (statusFilter === "settled" && g.status !== "settled") return false;
      return true;
    });
  }, [groups, query, statusFilter]);

  const counts = useMemo(() => {
    const total = groups?.length ?? 0;
    const active = groups?.filter((g) => g.status === "active").length ?? 0;
    const settled = groups?.filter((g) => g.status === "settled").length ?? 0;
    return { total, active, settled };
  }, [groups]);

  const global = groups ? computeGlobalBalance(groups) : { total: 0, currency: null };

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-lg p-lg lg:p-2xl">
      {/* Header */}
      <header className="flex flex-col gap-md lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-display-sm font-extrabold tracking-[-0.8px] text-text-primary">
            {t("listing.title")}
          </h1>
          <p className="mt-2xs text-md text-text-tertiary">
            {groups && groups.length > 0
              ? t("listing.subtitleWithStats", {
                  count: counts.active,
                  balance:
                    global.currency !== null
                      ? formatAmount(global.total, global.currency, { withSign: true })
                      : "—",
                })
              : t("listing.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-sm">
          {/* Search */}
          <label
            className={cn(
              "flex items-center gap-sm rounded-lg border border-border-strong bg-surface-card px-md py-sm",
              "focus-within:border-brand-default focus-within:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
              "transition-[border-color,box-shadow] duration-150",
            )}
          >
            <span className="text-text-muted">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("listing.searchPlaceholder")}
              className="w-[160px] bg-transparent text-[12.5px] font-medium text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>

          {/* Create button — solid brand */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={cn(
              "flex items-center gap-xs rounded-lg bg-brand-default px-md-plus py-sm-plus",
              "text-[13px] font-semibold text-text-on-brand shadow-md",
              "transition-colors duration-150 hover:bg-brand-hover",
              "focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
            )}
          >
            <PlusIcon />
            {t("listing.newGroup")}
          </button>
        </div>
      </header>

      {/* Status filter chips */}
      {!isPending && !isError && groups && groups.length > 0 && (
        <div className="flex flex-wrap gap-xs" role="group" aria-label={t("listing.filter.aria")}>
          <FilterChip
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            count={counts.total}
          >
            {t("listing.filter.all")}
          </FilterChip>
          <FilterChip
            active={statusFilter === "active"}
            onClick={() => setStatusFilter("active")}
            count={counts.active}
          >
            {t("listing.filter.active")}
          </FilterChip>
          <FilterChip
            active={statusFilter === "settled"}
            onClick={() => setStatusFilter("settled")}
            count={counts.settled}
          >
            {t("listing.filter.settled")}
          </FilterChip>
        </div>
      )}

      {/* Content */}
      {isPending && (
        <div className={cn("grid gap-md", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {Array.from({ length: 6 }).map((_, i) => (
            <GroupCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          variant="error"
          icon={
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 8v5m0 3v.01M4.9 18h14.2c1.5 0 2.4-1.6 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0L3.2 15c-.7 1.4.2 3 1.7 3z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          title={t("listing.error.title")}
          description={t("listing.error.description")}
          action={
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="rounded-lg border border-border-strong bg-surface-card px-md-plus py-sm-plus text-[13px] font-semibold text-text-primary hover:bg-surface-hover"
            >
              {t("listing.error.retry")}
            </button>
          }
        />
      )}

      {!isPending && !isError && groups && groups.length === 0 && (
        <div className="flex flex-col items-center px-lg py-2xl text-center">
          <GroupsEmptyIllustration />
          <h2 className="text-display-xs font-extrabold tracking-[-0.6px] text-text-primary">
            {t("listing.empty.title")}
          </h2>
          <p className="mt-sm max-w-[360px] text-md text-text-tertiary">{t("listing.empty.description")}</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={cn(
              "mt-lg flex items-center justify-center gap-sm rounded-[14px] bg-brand-default px-lg py-md",
              "text-[15px] font-bold text-text-on-brand shadow-lg",
              "transition-colors duration-150 hover:bg-brand-hover",
            )}
          >
            <PlusIcon />
            {t("listing.empty.action")}
          </button>
        </div>
      )}

      {!isPending && !isError && groups && groups.length > 0 && filteredGroups.length > 0 && (
        <div className={cn("grid gap-md", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} onOpen={() => setActiveGroup(group.id)} />
          ))}
          {query.trim() === "" && statusFilter === "all" && (
            <CreateGroupCard onClick={() => setModalOpen(true)} />
          )}
        </div>
      )}

      {!isPending && !isError && groups && groups.length > 0 && filteredGroups.length === 0 && (
        <p className="px-lg py-xl text-center text-md text-text-tertiary">
          {query.trim() !== ""
            ? t("listing.noResults", { query })
            : t(`listing.noResultsFilter.${statusFilter}`)}
        </p>
      )}

      <CreateGroupModal open={modalOpen} onOpenChange={setModalOpen} onCreated={handleCreated} />
    </div>
  );
}
