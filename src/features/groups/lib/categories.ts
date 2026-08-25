import type { Category } from "@/types";

export type CategoryVisual = { emoji: string; bg: string; fg: string };

const DEFAULTS: Record<string, CategoryVisual> = {
  cat_food: { emoji: "🍽️", bg: "bg-accent-mustard-subtle", fg: "text-accent-mustard-strong" },
  cat_transport: { emoji: "🚗", bg: "bg-brand-subtle", fg: "text-brand-default" },
  cat_housing: { emoji: "🏠", bg: "bg-feedback-success-subtle", fg: "text-feedback-success" },
  cat_leisure: { emoji: "🎉", bg: "bg-accent-plum-subtle", fg: "text-accent-plum" },
  cat_utilities: {
    emoji: "⚡",
    bg: "bg-feedback-warning-subtle-strong",
    fg: "text-feedback-warning-strong",
  },
  cat_shopping: { emoji: "🛍️", bg: "bg-brand-secondary-subtle", fg: "text-brand-secondary" },
  cat_health: { emoji: "❤️", bg: "bg-feedback-danger-subtle", fg: "text-feedback-danger" },
  cat_other: { emoji: "📌", bg: "bg-surface-subtle", fg: "text-text-secondary" },
};

const FALLBACK: CategoryVisual = { emoji: "📌", bg: "bg-surface-subtle", fg: "text-text-secondary" };

export function getCategoryVisual(categoryId: string): CategoryVisual {
  return DEFAULTS[categoryId] ?? FALLBACK;
}

export function findCategoryName(categoryId: string, categories: Category[] | undefined): string {
  return categories?.find((c) => c.id === categoryId)?.name ?? "";
}
