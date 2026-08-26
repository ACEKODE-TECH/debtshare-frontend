import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { CurrencyCode, ExpenseSplit } from "@/types";

import { GROUPS_QUERY_KEY } from "./use-groups";
import { groupBalancesQueryKey } from "./use-group-balances";
import { groupExpensesQueryKey } from "./use-group-expenses";

export type CreateExpenseRequest = {
  description: string;
  amount: number;
  currency: CurrencyCode;
  categoryId: string;
  date: string; // ISO
  paidBy: string;
  /** Members excluded from the equal split — everyone else in the group participates. */
  excludeMembers: string[];
};

export type CreateExpenseResponse = {
  id: string;
  splits: ExpenseSplit[];
};

/**
 * Creates a new expense in a group. On success, invalidates the group's expenses,
 * balances and the top-level groups list (so summary aggregates refresh).
 */
export function useCreateExpense(groupId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpenseRequest) =>
      api.post<CreateExpenseResponse>(ENDPOINTS.GROUP_EXPENSES(groupId as string), payload),
    onSuccess: () => {
      if (!groupId) return;
      qc.invalidateQueries({ queryKey: groupExpensesQueryKey(groupId, 25) });
      qc.invalidateQueries({ queryKey: groupBalancesQueryKey(groupId) });
      qc.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
    },
  });
}
