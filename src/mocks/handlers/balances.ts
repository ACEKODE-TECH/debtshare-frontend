import { http, HttpResponse } from "msw";

import type { Balance, BalanceWithUser, DebtEdge } from "@/types";

import { getDb } from "../db";
import { convertAmount } from "../exchange";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

function computeGroupBalances(groupId: string): Balance[] {
  const db = getDb();
  const group = db.groups.find((g) => g.id === groupId);
  const gc = group?.currency ?? "EUR";
  const memberIds = db.groupMembers.filter((m) => m.groupId === groupId).map((m) => m.userId);
  const net = new Map<string, number>(memberIds.map((id) => [id, 0]));

  // Everything is normalized to the group currency before entering the ledger.
  for (const expense of db.expenses.filter((e) => e.groupId === groupId)) {
    const paidGc = convertAmount(expense.amount, expense.currency, gc);
    net.set(expense.paidBy, (net.get(expense.paidBy) ?? 0) + paidGc);
    for (const split of db.expenseSplits.filter((s) => s.expenseId === expense.id)) {
      const owedGc = convertAmount(split.amount, expense.currency, gc);
      net.set(split.userId, (net.get(split.userId) ?? 0) - owedGc);
    }
  }

  for (const settlement of db.settlements.filter((s) => s.groupId === groupId && s.status === "completed")) {
    const amountGc = convertAmount(settlement.amount, settlement.currency, gc);
    net.set(settlement.fromUserId, (net.get(settlement.fromUserId) ?? 0) + amountGc);
    net.set(settlement.toUserId, (net.get(settlement.toUserId) ?? 0) - amountGc);
  }

  return memberIds.map((userId) => ({
    groupId,
    userId,
    amount: Math.round((net.get(userId) ?? 0) * 100) / 100,
    currency: gc,
  }));
}

function simplifyDebts(balances: Balance[]): DebtEdge[] {
  const debtors = balances.filter((b) => b.amount < -0.005).map((b) => ({ ...b }));
  const creditors = balances.filter((b) => b.amount > 0.005).map((b) => ({ ...b }));
  const edges: DebtEdge[] = [];

  debtors.sort((a, b) => a.amount - b.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.round(Math.min(-debtor.amount, creditor.amount) * 100) / 100;

    if (amount > 0) {
      edges.push({
        from: debtor.userId,
        to: creditor.userId,
        amount,
        currency: debtor.currency,
      });
      debtor.amount += amount;
      creditor.amount -= amount;
    }

    if (Math.abs(debtor.amount) < 0.005) i += 1;
    if (Math.abs(creditor.amount) < 0.005) j += 1;
  }

  return edges;
}

export const balanceHandlers = [
  // GET /groups/:groupId/balances — each row includes the hydrated user for the UI
  http.get("/api/groups/:groupId/balances", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    const db = getDb();
    const balances = computeGroupBalances(String(params.groupId));
    const rows: BalanceWithUser[] = balances.map((b) => {
      const u = db.users.find((user) => user.id === b.userId);
      return {
        ...b,
        user: u ? { id: u.id, name: u.name, avatarUrl: u.avatarUrl } : null,
      };
    });
    return HttpResponse.json(rows);
  }),

  // GET /groups/:groupId/debts
  http.get("/api/groups/:groupId/debts", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    const balances = computeGroupBalances(String(params.groupId));
    return HttpResponse.json(simplifyDebts(balances));
  }),
];
