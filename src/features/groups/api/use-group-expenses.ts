import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { ExpenseListItem } from "@/types";

interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export const groupExpensesQueryKey = (groupId: string, limit: number) =>
  ["group-expenses", groupId, limit] as const;

/**
 * First page of a group's expense feed (newest first). Cursor-based pagination
 * lives here so infinite scroll can be added later without touching consumers.
 */
export function useGroupExpenses(groupId: string | undefined, limit = 25) {
  return useQuery({
    queryKey: groupExpensesQueryKey(groupId ?? "", limit),
    queryFn: () =>
      api.get<CursorPage<ExpenseListItem>>(`${ENDPOINTS.GROUP_EXPENSES(groupId as string)}?limit=${limit}`),
    enabled: !!groupId,
  });
}
