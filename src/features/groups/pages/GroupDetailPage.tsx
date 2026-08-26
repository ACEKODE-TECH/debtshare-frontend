import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import { Avatar, AvatarGroup, Button, EmptyState } from "@/shared/components/ui";
import { useCategories } from "@/shared/api/use-categories";
import { cn } from "@/shared/lib/cn";
import type { Category, ExpenseListItem, GroupSummary } from "@/types";

import { useGroupBalances } from "../api/use-group-balances";
import { useGroupExpenses } from "../api/use-group-expenses";
import { useGroups } from "../api/use-groups";
import { BalanceSidePanel } from "../components/BalanceSidePanel";
import { CategorySummaryCard } from "../components/CategorySummaryCard";
import { ExpenseFeed } from "../components/ExpenseFeed";
import { FilterDropdown, type FilterOption } from "../components/FilterDropdown";
import { GroupSwitcher } from "../components/GroupSwitcher";
import { getCategoryVisual } from "../lib/categories";
import { useActiveGroupStore } from "../stores/active-group-store";

type DateFilter = "all" | "7d" | "30d" | "90d";
const DATE_FILTER_DAYS: Record<Exclude<DateFilter, "all">, number> = { "7d": 7, "30d": 30, "90d": 90 };

function PlusIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function InviteIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M20 8v6M23 11h-6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2V3z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownSmall() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function BackChevron() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-lg">
      {[0, 1].map((s) => (
        <div key={s}>
          <div className="mb-sm h-[11px] w-[80px] animate-pulse rounded bg-surface-subtle" />
          <div className="flex flex-col gap-sm">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-md rounded-2xl border border-border-divider bg-surface-card px-md-plus py-md-plus"
              >
                <div className="h-[44px] w-[44px] flex-none animate-pulse rounded-xl bg-surface-subtle" />
                <div className="flex-1 space-y-2xs">
                  <div className="h-[15px] w-2/3 animate-pulse rounded bg-surface-subtle" />
                  <div className="h-[11px] w-1/3 animate-pulse rounded bg-surface-subtle" />
                </div>
                <div className="flex flex-col items-end gap-2xs">
                  <div className="h-[15px] w-[70px] animate-pulse rounded bg-surface-subtle" />
                  <div className="h-[11px] w-[54px] animate-pulse rounded bg-surface-subtle" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 3H2l8 9.5V19l4 2v-8.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function useCategoryOptions(categories: Category[] | undefined): FilterOption<string>[] {
  const { t } = useTranslation("groups");
  return useMemo(() => {
    const all: FilterOption<string> = { value: "all", label: t("detail.filters.allCategories") };
    const rest: FilterOption<string>[] = (categories ?? []).map((c) => {
      const visual = getCategoryVisual(c.id);
      return {
        value: c.id,
        label: c.name,
        icon: <span aria-hidden>{visual.emoji}</span>,
      };
    });
    return [all, ...rest];
  }, [categories, t]);
}

function useDateOptions(): FilterOption<DateFilter>[] {
  const { t } = useTranslation("groups");
  return useMemo(
    () => [
      { value: "7d", label: t("detail.filters.last7d") },
      { value: "30d", label: t("detail.filters.last30d") },
      { value: "90d", label: t("detail.filters.last90d") },
      { value: "all", label: t("detail.filters.allTime") },
    ],
    [t],
  );
}

function GroupHeader({
  group,
  groups,
  memberSince,
}: {
  group: GroupSummary;
  groups: GroupSummary[];
  memberSince: string;
}) {
  const { t } = useTranslation("groups");

  const membersLabel = t("detail.header.membersCount", { count: group.memberCount });
  const sinceLabel = t("detail.header.since", { date: memberSince });
  const expensesLabel = t("detail.header.expensesCount", { count: group.expenseCount });

  return (
    <div className="flex flex-col gap-lg sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <GroupSwitcher
          currentGroupId={group.id}
          groups={groups}
          trigger={
            <>
              <h1 className="truncate text-display-sm font-extrabold leading-[1.15] tracking-[-0.7px] text-text-primary md:text-display-md">
                {group.name}
              </h1>
              <span className="ml-xs text-text-secondary">
                <ChevronDownSmall />
              </span>
            </>
          }
        />

        <div className="mt-sm flex items-center gap-sm-plus">
          {group.memberPreview.length > 0 && (
            <AvatarGroup max={4} size="md" borderClassName="border-surface-bg">
              {group.memberPreview.map((m) =>
                m.avatarUrl ? (
                  <Avatar
                    key={m.id}
                    variant="image"
                    size="md"
                    src={m.avatarUrl}
                    alt={m.name}
                    fallbackInitials={m.name}
                  />
                ) : (
                  <Avatar key={m.id} variant="initials" size="md" name={m.name} />
                ),
              )}
            </AvatarGroup>
          )}
          <span className="text-md font-medium text-text-tertiary">
            {membersLabel} · {sinceLabel} · {expensesLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-none gap-sm">
        <Button intent="secondary" leftIcon={<InviteIcon />} disabled title={t("detail.inviteComingSoon")}>
          {t("detail.invite")}
        </Button>
        <Button intent="primary" leftIcon={<PlusIcon />} disabled title={t("detail.newExpenseComingSoon")}>
          {t("detail.newExpense")}
        </Button>
      </div>
    </div>
  );
}

function TabsRow({
  expenseCount,
  categories,
  categoryFilter,
  onCategoryFilter,
  dateFilter,
  onDateFilter,
}: {
  expenseCount: number;
  categories: Category[] | undefined;
  categoryFilter: string;
  onCategoryFilter: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilter: (value: DateFilter) => void;
}) {
  const { t } = useTranslation("groups");
  const tabBase = "flex-none border-b-2 pb-md pt-sm text-md font-bold transition-colors duration-150";
  const categoryOptions = useCategoryOptions(categories);
  const dateOptions = useDateOptions();
  return (
    <div className="flex flex-wrap items-end justify-between gap-md border-b border-border-divider">
      <div className="flex gap-xl">
        <button type="button" className={cn(tabBase, "border-brand-default text-text-primary")}>
          {t("detail.tabs.expenses")}
          <span className="ml-xs text-md font-medium text-text-muted">· {expenseCount}</span>
        </button>
        <button
          type="button"
          disabled
          className={cn(tabBase, "cursor-not-allowed border-transparent text-text-muted opacity-70")}
        >
          {t("detail.tabs.activity")}
        </button>
        <button
          type="button"
          disabled
          className={cn(tabBase, "cursor-not-allowed border-transparent text-text-muted opacity-70")}
        >
          {t("detail.tabs.notes")}
        </button>
      </div>

      <div className="flex gap-xs pb-sm">
        <FilterDropdown
          ariaLabel={t("detail.filters.categoryAria")}
          triggerIcon={<CategoryIcon />}
          value={categoryFilter}
          options={categoryOptions}
          onChange={onCategoryFilter}
        />
        <FilterDropdown
          ariaLabel={t("detail.filters.dateAria")}
          triggerIcon={<CalendarIcon />}
          value={dateFilter}
          options={dateOptions}
          onChange={onDateFilter}
        />
      </div>
    </div>
  );
}

export function GroupDetailPage() {
  const { groupId } = useParams();
  const { t, i18n } = useTranslation("groups");
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);

  const { data: groups, isPending: groupsPending, isError: groupsError } = useGroups();
  const {
    data: expensesPage,
    isPending: expensesPending,
    isError: expensesError,
    refetch: refetchExpenses,
    isRefetching: expensesRefetching,
  } = useGroupExpenses(groupId);
  const { data: balances, isPending: balancesPending, isError: balancesError } = useGroupBalances(groupId);
  const { data: categories } = useCategories();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  useEffect(() => {
    if (groupId) setActiveGroup(groupId);
  }, [groupId, setActiveGroup]);

  // Reset filters when navigating to a different group. This is a URL-driven
  // reset, not a cascading state update — no risk of an infinite render loop.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset triggered by route change only
    setCategoryFilter("all");

    setDateFilter("all");
  }, [groupId]);

  const filteredExpenses = useMemo<ExpenseListItem[]>(() => {
    const items = expensesPage?.items ?? [];
    // Cutoff is intentionally recomputed from the render clock; the memo only
    // re-fires when filters or items change, and users expect "hoy" to move with the clock.
    // eslint-disable-next-line react-hooks/purity -- Date.now() is a controlled impurity, gated by memo deps
    const now = Date.now();
    const cutoff = dateFilter === "all" ? null : now - DATE_FILTER_DAYS[dateFilter] * 24 * 60 * 60 * 1000;
    return items.filter((e) => {
      if (categoryFilter !== "all" && e.categoryId !== categoryFilter) return false;
      if (cutoff !== null && new Date(e.date).getTime() < cutoff) return false;
      return true;
    });
  }, [expensesPage?.items, categoryFilter, dateFilter]);

  const group = groups?.find((g) => g.id === groupId);

  if (!groupsPending && !groupsError && groups && !group) {
    return (
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-lg p-lg lg:p-2xl">
        <EmptyState
          variant="error"
          icon={<ReceiptIcon />}
          title={t("detail.notFound.title")}
          description={t("detail.notFound.description")}
          action={
            <Link
              to="/app/groups"
              className="rounded-lg border border-border-strong bg-surface-card px-md-plus py-sm-plus text-md font-semibold text-text-primary hover:bg-surface-hover"
            >
              {t("detail.notFound.action")}
            </Link>
          }
        />
      </div>
    );
  }

  const memberSince = group
    ? new Intl.DateTimeFormat(i18n.language, { month: "short", year: "numeric" }).format(
        new Date(group.createdAt),
      )
    : "";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-xl p-lg lg:p-2xl">
      {/* Breadcrumb */}
      <Link
        to="/app/groups"
        className="inline-flex items-center gap-xs self-start rounded-lg text-md-plus font-semibold text-text-secondary transition-colors hover:text-text-primary"
      >
        <BackChevron />
        {t("detail.breadcrumb")}
      </Link>

      {groupsPending && <div className="h-[110px] w-full animate-pulse rounded-xl bg-surface-subtle" />}
      {group && groups && <GroupHeader group={group} groups={groups} memberSince={memberSince} />}

      {/* Two column layout */}
      <div className="grid gap-xl lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-lg">
          <TabsRow
            expenseCount={filteredExpenses.length}
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryFilter={setCategoryFilter}
            dateFilter={dateFilter}
            onDateFilter={setDateFilter}
          />

          {expensesPending && <FeedSkeleton />}

          {expensesError && (
            <EmptyState
              variant="error"
              icon={<ReceiptIcon />}
              title={t("detail.feed.error.title")}
              description={t("detail.feed.error.description")}
              action={
                <button
                  type="button"
                  onClick={() => refetchExpenses()}
                  disabled={expensesRefetching}
                  className="rounded-lg border border-border-strong bg-surface-card px-md-plus py-sm-plus text-md font-semibold text-text-primary hover:bg-surface-hover"
                >
                  {t("detail.feed.error.retry")}
                </button>
              }
            />
          )}

          {!expensesPending && !expensesError && expensesPage && expensesPage.items.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface-card px-lg py-2xl text-center">
              <div className="mb-md flex h-[68px] w-[68px] items-center justify-center rounded-pill bg-brand-subtle text-brand-default">
                <ReceiptIcon />
              </div>
              <h3 className="text-lg font-extrabold text-text-primary">{t("detail.feed.empty.title")}</h3>
              <p className="mt-xs max-w-[360px] text-md text-text-tertiary">
                {t("detail.feed.empty.description")}
              </p>
              <Button intent="primary" className="mt-lg" leftIcon={<PlusIcon />} disabled>
                {t("detail.newExpense")}
              </Button>
            </div>
          )}

          {!expensesPending &&
            !expensesError &&
            expensesPage &&
            expensesPage.items.length > 0 &&
            filteredExpenses.length > 0 && (
              <ExpenseFeed
                expenses={filteredExpenses}
                currentUserId={currentUserId}
                categories={categories}
              />
            )}

          {!expensesPending &&
            !expensesError &&
            expensesPage &&
            expensesPage.items.length > 0 &&
            filteredExpenses.length === 0 && (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface-card px-lg py-xl-plus text-center">
                <p className="text-md-plus font-semibold text-text-secondary">
                  {t("detail.feed.noResultsForFilter")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter("all");
                    setDateFilter("all");
                  }}
                  className="mt-sm text-md font-bold text-brand-default hover:text-brand-hover"
                >
                  {t("detail.feed.clearFilters")}
                </button>
              </div>
            )}

          {expensesPage?.hasMore && (
            <p className="mt-sm text-center text-sm-plus text-text-muted">{t("detail.feed.morePending")}</p>
          )}
        </div>

        {/* Side panel */}
        {group && (
          <div className="flex flex-col gap-lg">
            <BalanceSidePanel
              balances={balances}
              isPending={balancesPending}
              isError={balancesError}
              currency={group.currency}
              currentUserId={currentUserId}
            />
            {filteredExpenses.length > 0 && (
              <CategorySummaryCard
                expenses={filteredExpenses}
                categories={categories}
                currency={group.currency}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
