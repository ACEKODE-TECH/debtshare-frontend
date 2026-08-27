import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { convertAmount, useExchangeRate } from "@/shared/api/use-exchange-rate";
import { Avatar, AvatarGroup } from "@/shared/components/ui";
import { cn } from "@/shared/lib/cn";
import type { Category, CurrencyCode, ExpenseListItem } from "@/types";

import { findCategoryName, getCategoryVisual } from "../lib/categories";
import { formatAmount } from "../lib/format";

export type ExpenseFeedItemProps = {
  expense: ExpenseListItem;
  currentUserId: string | null;
  categories: Category[] | undefined;
  groupCurrency: CurrencyCode;
};

export function ExpenseFeedItem({ expense, currentUserId, categories, groupCurrency }: ExpenseFeedItemProps) {
  const { groupId } = useParams();
  const { t } = useTranslation("groups");
  const visual = getCategoryVisual(expense.categoryId);
  const categoryName = findCategoryName(expense.categoryId, categories);
  const iPaid = currentUserId != null && expense.paidBy === currentUserId;
  const needsConversion = expense.currency !== groupCurrency;
  const { data: rate } = useExchangeRate(
    needsConversion ? expense.currency : undefined,
    needsConversion ? groupCurrency : undefined,
  );

  const delta = iPaid ? Math.round((expense.amount - expense.myShare) * 100) / 100 : -expense.myShare;
  const deltaClass =
    delta > 0 ? "text-feedback-success" : delta < 0 ? "text-feedback-danger" : "text-text-muted";

  const paidByLabel = iPaid
    ? t("detail.feed.youPaid")
    : t("detail.feed.userPaid", { name: expense.paidByUser.name.split(" ")[0] });

  return (
    <Link
      to={`/app/groups/${groupId}/expenses/${expense.id}`}
      className={cn(
        "group flex items-center gap-md rounded-2xl border border-border-divider bg-surface-card px-md-plus py-md-plus",
        "transition-all duration-150 hover:border-border-strong hover:shadow-sm",
      )}
    >
      <span
        className={cn(
          "flex h-[44px] w-[44px] flex-none items-center justify-center rounded-xl text-xl-plus",
          visual.bg,
          visual.fg,
        )}
        aria-hidden
      >
        {visual.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-lg font-extrabold tracking-[-0.2px] text-text-primary">
          {expense.description}
        </div>
        <div className="mt-2xs truncate text-sm-plus font-medium text-text-tertiary">
          {paidByLabel}
          <span aria-hidden> · </span>
          {t("detail.feed.splitAcross", { count: expense.splitCount })}
          {categoryName && (
            <>
              <span aria-hidden> · </span>
              <span className="lowercase">{categoryName}</span>
            </>
          )}
        </div>
      </div>

      {expense.participants.length > 0 && (
        <div className="hidden flex-none sm:block">
          <AvatarGroup max={4} size="sm">
            {expense.participants.map((p) =>
              p.avatarUrl ? (
                <Avatar
                  key={p.id}
                  variant="image"
                  size="sm"
                  src={p.avatarUrl}
                  alt={p.name}
                  fallbackInitials={p.name}
                />
              ) : (
                <Avatar key={p.id} variant="initials" size="sm" name={p.name} />
              ),
            )}
          </AvatarGroup>
        </div>
      )}

      <div className="flex flex-none flex-col items-end min-w-[86px]">
        <div className="text-lg font-extrabold tabular-nums tracking-[-0.3px] text-text-primary">
          {formatAmount(expense.amount, expense.currency)}
        </div>
        {needsConversion && rate && (
          <div className="mt-2xs text-[11px] font-medium tabular-nums text-text-muted">
            ≈ {formatAmount(convertAmount(expense.amount, rate.rate), groupCurrency)}
          </div>
        )}
        <div className={cn("mt-2xs text-sm-plus font-bold tabular-nums", deltaClass)}>
          {delta === 0
            ? t("detail.feed.notInvolved")
            : formatAmount(delta, expense.currency, { withSign: true })}
        </div>
      </div>
    </Link>
  );
}
