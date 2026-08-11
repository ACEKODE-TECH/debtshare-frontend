import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { cardStyles, categoryIconStyles } from "./ExpenseCard.styles";

export type ExpenseCategory = "food" | "transport" | "lodging" | "leisure" | "shopping" | "other";

export type ExpenseCardVariant = "default" | "compact" | "settled";

export type ExpenseCardProps = {
  title: string;
  subtitle: string;
  amount: number;
  delta: number;
  currency?: string;
  locale?: string;
  category?: ExpenseCategory;
  categoryIcon?: ReactNode;
  variant?: ExpenseCardVariant;
  settled?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "title">;

const CATEGORY_COLORS: Record<ExpenseCategory, { bg: string; fg: string }> = {
  food: { bg: "bg-category-food-bg", fg: "text-category-food-fg" },
  transport: { bg: "bg-category-transport-bg", fg: "text-category-transport-fg" },
  lodging: { bg: "bg-category-lodging-bg", fg: "text-category-lodging-fg" },
  leisure: { bg: "bg-category-leisure-bg", fg: "text-category-leisure-fg" },
  shopping: { bg: "bg-category-shopping-bg", fg: "text-category-shopping-fg" },
  other: { bg: "bg-category-other-bg", fg: "text-category-other-fg" },
};

const DEFAULT_ICONS: Record<ExpenseCategory, ReactNode> = {
  food: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7 2v6a3 3 0 0 0 2 2.83V18M7 8H5M7 5H4M13 2c0 3 2 4.5 2 7a2 2 0 0 1-2 2 2 2 0 0 1-2-2c0-2.5 2-4 2-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 11v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  transport: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6.5" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 11h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  lodging: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M2 17V7l8-4 8 4v10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="7" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  leisure: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 12s1.2 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7.5" cy="8.5" r="0.75" fill="currentColor" />
      <circle cx="12.5" cy="8.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  shopping: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 5h2l1.68 8.39a1 1 0 0 0 1 .81h6.44a1 1 0 0 0 1-.76L17.5 7H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="17" r="1" fill="currentColor" />
      <circle cx="15" cy="17" r="1" fill="currentColor" />
    </svg>
  ),
  other: (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
      <circle cx="13" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
};

function formatCurrency(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
}

function formatDelta(value: number, locale: string, currency: string): { text: string; colorClass: string } {
  if (Math.abs(value) < 0.005) {
    return { text: "Sin impacto", colorClass: "text-text-tertiary" };
  }

  const formatted = formatCurrency(value, locale, currency);
  if (value > 0) {
    return { text: `+${formatted}`, colorClass: "text-feedback-success" };
  }
  return { text: `−${formatted}`, colorClass: "text-feedback-danger" };
}

function ExpenseCardImpl(
  {
    title,
    subtitle,
    amount,
    delta,
    currency = "EUR",
    locale = "es-ES",
    category = "other",
    categoryIcon,
    variant = "default",
    settled,
    className,
    ...rest
  }: ExpenseCardProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const isSettled = settled ?? variant === "settled";
  const effectiveVariant = isSettled ? "settled" : variant;
  const isCompact = variant === "compact";

  const colors = CATEGORY_COLORS[category];
  const icon = categoryIcon ?? DEFAULT_ICONS[category];
  const iconSize = isCompact ? "compact" : "default";

  const formattedAmount = formatCurrency(amount, locale, currency);
  const deltaInfo = isSettled
    ? { text: "Saldado", colorClass: "text-text-tertiary" }
    : formatDelta(delta, locale, currency);

  return (
    <div
      ref={ref}
      role="article"
      className={cn(cardStyles({ variant: effectiveVariant }), className)}
      {...rest}
    >
      <div
        className={cn(
          categoryIconStyles({ size: iconSize }),
          colors.bg,
          colors.fg,
          isSettled && "opacity-60 grayscale",
        )}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2xs overflow-hidden">
        <p
          className={cn(
            "truncate font-sans text-2xl font-extrabold tracking-[-0.3px]",
            isSettled ? "text-text-muted" : "text-text-primary",
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "truncate font-sans text-md font-medium",
            isSettled ? "text-text-muted" : "text-text-tertiary",
          )}
        >
          {subtitle}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2xs whitespace-nowrap">
        <span
          className={cn(
            "font-sans text-xl font-extrabold tracking-[-0.3px]",
            isSettled ? "text-text-muted" : "text-text-primary",
          )}
        >
          {formattedAmount}
        </span>
        <span className={cn("font-sans text-md font-bold", deltaInfo.colorClass)}>{deltaInfo.text}</span>
      </div>
    </div>
  );
}

export const ExpenseCard = forwardRef<HTMLDivElement, ExpenseCardProps>(ExpenseCardImpl);
ExpenseCard.displayName = "ExpenseCard";
