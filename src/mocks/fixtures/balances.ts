import type { Balance, DebtEdge } from "@/types";

import { expenses, expenseSplits } from "./expenses";
import { groupMembers } from "./groups";
import { settlements } from "./settlements";

/**
 * Derives each member's net balance for a group from its expenses, splits and
 * completed settlements. This is mock-only bookkeeping to back the fixture
 * endpoints; the real, tested implementation belongs to the expenses feature.
 */
export function computeGroupBalances(groupId: string): Balance[] {
  const memberIds = groupMembers.filter((m) => m.groupId === groupId).map((m) => m.userId);
  const net = new Map<string, number>(memberIds.map((id) => [id, 0]));

  for (const expense of expenses.filter((e) => e.groupId === groupId)) {
    net.set(expense.paidBy, (net.get(expense.paidBy) ?? 0) + expense.amount);
    for (const split of expenseSplits.filter((s) => s.expenseId === expense.id)) {
      net.set(split.userId, (net.get(split.userId) ?? 0) - split.amount);
    }
  }

  for (const settlement of settlements.filter((s) => s.groupId === groupId && s.status === "completed")) {
    net.set(settlement.fromUserId, (net.get(settlement.fromUserId) ?? 0) + settlement.amount);
    net.set(settlement.toUserId, (net.get(settlement.toUserId) ?? 0) - settlement.amount);
  }

  return memberIds.map((userId) => ({
    groupId,
    userId,
    amount: Math.round((net.get(userId) ?? 0) * 100) / 100,
    currency: "EUR",
  }));
}

/** Greedy min-cash-flow simplification: repeatedly settles the largest debtor against the largest creditor. */
export function simplifyDebts(balances: Balance[]): DebtEdge[] {
  const debtors = balances.filter((b) => b.amount < -0.005).map((b) => ({ ...b }));
  const creditors = balances.filter((b) => b.amount > 0.005).map((b) => ({ ...b }));
  const edges: DebtEdge[] = [];

  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.round(Math.min(-debtor.amount, creditor.amount) * 100) / 100;

    if (amount > 0) {
      edges.push({ from: debtor.userId, to: creditor.userId, amount, currency: debtor.currency });
      debtor.amount += amount;
      creditor.amount -= amount;
    }

    if (Math.abs(debtor.amount) < 0.005) i += 1;
    if (Math.abs(creditor.amount) < 0.005) j += 1;
  }

  return edges;
}
