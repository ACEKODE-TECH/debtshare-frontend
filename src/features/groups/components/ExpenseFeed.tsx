import { useMemo } from "react";

import type { Category, ExpenseListItem } from "@/types";

import { formatFeedDateHeader } from "../lib/format";
import { ExpenseFeedItem } from "./ExpenseFeedItem";

export type ExpenseFeedProps = {
  expenses: ExpenseListItem[];
  currentUserId: string | null;
  categories: Category[] | undefined;
};

type FeedSection = { key: string; label: string; items: ExpenseListItem[] };

function groupByDate(expenses: ExpenseListItem[]): FeedSection[] {
  const now = new Date();
  const sections: FeedSection[] = [];
  // Keyed by the rendered label so the grouping granularity always matches
  // what the reader sees (day for this year, month for older years).
  const seen = new Map<string, FeedSection>();

  for (const e of expenses) {
    const label = formatFeedDateHeader(e.date, now);
    let section = seen.get(label);
    if (!section) {
      section = { key: label, label, items: [] };
      seen.set(label, section);
      sections.push(section);
    }
    section.items.push(e);
  }
  return sections;
}

export function ExpenseFeed({ expenses, currentUserId, categories }: ExpenseFeedProps) {
  const sections = useMemo(() => groupByDate(expenses), [expenses]);

  return (
    <div className="flex flex-col gap-lg-plus">
      {sections.map((section) => (
        <section key={section.key} aria-label={section.label}>
          <div className="mb-sm px-2xs text-xs font-bold uppercase tracking-[0.8px] text-text-muted">
            {section.label}
          </div>
          <div className="flex flex-col gap-sm">
            {section.items.map((expense) => (
              <ExpenseFeedItem
                key={expense.id}
                expense={expense}
                currentUserId={currentUserId}
                categories={categories}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
