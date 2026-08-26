import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/lib/cn";
import type { Category, ExpenseListItem } from "@/types";

import { getCategoryVisual, findCategoryName } from "../lib/categories";
import { formatAmount } from "../lib/format";

export type CategorySummaryCardProps = {
  expenses: ExpenseListItem[];
  categories: Category[] | undefined;
  currency: string;
};

const BAR_COLORS: Record<string, string> = {
  cat_food: "bg-accent-mustard-strong",
  cat_transport: "bg-brand-default",
  cat_housing: "bg-feedback-success",
  cat_leisure: "bg-accent-plum",
  cat_utilities: "bg-feedback-warning-strong",
  cat_shopping: "bg-brand-secondary",
  cat_health: "bg-feedback-danger",
  cat_other: "bg-text-secondary",
};

export function CategorySummaryCard({ expenses, categories, currency }: CategorySummaryCardProps) {
  const { t } = useTranslation("groups");

  const { total, bars } = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of expenses) totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amount);
    const total = Array.from(totals.values()).reduce((a, b) => a + b, 0);
    const bars = Array.from(totals.entries())
      .map(([categoryId, amount]) => ({
        categoryId,
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: BAR_COLORS[categoryId] ?? BAR_COLORS.cat_other,
        name: findCategoryName(categoryId, categories),
        visual: getCategoryVisual(categoryId),
      }))
      .sort((a, b) => b.amount - a.amount);
    return { total, bars };
  }, [expenses, categories]);

  if (bars.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border-divider bg-surface-card p-xl">
      <div className="text-xs font-bold uppercase tracking-[0.7px] text-text-muted">
        {t("detail.sidePanel.monthlyTitle")}
      </div>
      <div className="mt-xs flex items-baseline gap-sm">
        <div className="text-display-sm font-extrabold leading-none tracking-[-0.6px] text-text-primary">
          {formatAmount(total, currency)}
        </div>
        <div className="text-md font-semibold text-text-muted">{t("detail.sidePanel.monthlyLabel")}</div>
      </div>

      <div className="mt-lg flex flex-col gap-md">
        {bars.map((bar) => (
          <div key={bar.categoryId}>
            <div className="mb-xs flex items-center justify-between text-md">
              <span className="flex items-center gap-xs text-text-secondary">
                <span aria-hidden>{bar.visual.emoji}</span>
                <span className="font-semibold">{bar.name}</span>
              </span>
              <span className="font-extrabold tabular-nums text-text-primary">
                {formatAmount(bar.amount, currency)}
              </span>
            </div>
            <div className="h-[8px] overflow-hidden rounded-pill bg-surface-subtle">
              <div
                className={cn("h-full rounded-pill", bar.color)}
                style={{ width: `${Math.max(bar.percent, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
