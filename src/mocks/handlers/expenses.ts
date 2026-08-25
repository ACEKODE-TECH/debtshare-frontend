import { http, HttpResponse } from "msw";

import type { Expense, ExpenseListItem } from "@/types";

import { getDb } from "../db";
import { createEqualSplits, createExpense, createNotification } from "../factories";
import { cursorPaginate, errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const expenseHandlers = [
  // GET /groups/:groupId/expenses — cursor-paginated, newest first
  // Rows are enriched with paidByUser + the current user's share for feed rendering.
  http.get("/api/groups/:groupId/expenses", async ({ request, params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? "10");
    const categoryId = url.searchParams.get("categoryId");

    const db = getDb();
    const myId = db.users[0].id;
    let groupExpenses = db.expenses
      .filter((e) => e.groupId === params.groupId)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (categoryId) {
      groupExpenses = groupExpenses.filter((e) => e.categoryId === categoryId);
    }

    const page = cursorPaginate(groupExpenses, cursor, limit);
    const items: ExpenseListItem[] = page.items.map((e) => {
      const paidByUser = db.users.find((u) => u.id === e.paidBy);
      const splits = db.expenseSplits.filter((s) => s.expenseId === e.id);
      const mySplit = splits.find((s) => s.userId === myId);
      const participants = splits
        .map((s) => db.users.find((u) => u.id === s.userId))
        .filter((u): u is NonNullable<typeof u> => u !== undefined)
        .map((u) => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl }));
      return {
        ...e,
        paidByUser: paidByUser
          ? { id: paidByUser.id, name: paidByUser.name, avatarUrl: paidByUser.avatarUrl }
          : { id: e.paidBy, name: "—", avatarUrl: null },
        myShare: mySplit?.amount ?? 0,
        splitCount: splits.length,
        participants,
      };
    });

    return HttpResponse.json({ ...page, items });
  }),

  // GET /expenses/:id — includes splits
  http.get("/api/expenses/:id", async ({ params }) => {
    await randomDelayMs();
    const db = getDb();
    const expense = db.expenses.find((e) => e.id === params.id);
    if (!expense) return errorResponse(404, "Gasto no encontrado");

    const splits = db.expenseSplits.filter((s) => s.expenseId === expense.id);
    return HttpResponse.json({ ...expense, splits });
  }),

  // POST /groups/:groupId/expenses — create + auto-generate splits & notifications
  http.post("/api/groups/:groupId/expenses", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const groupId = String(params.groupId);
    const body = (await request.json()) as Partial<Expense> & {
      excludeMembers?: string[];
    };

    const group = db.groups.find((g) => g.id === groupId);
    if (!group) return errorResponse(404, "Grupo no encontrado");

    const me = db.users[0];
    const expense = createExpense({
      ...body,
      groupId,
      paidBy: body.paidBy ?? me.id,
      createdBy: me.id,
      createdAt: new Date().toISOString(),
    });
    db.expenses.push(expense);

    // Equal splits among group members minus excluded
    const excluded = new Set(body.excludeMembers ?? []);
    const memberIds = db.groupMembers
      .filter((m) => m.groupId === groupId && !excluded.has(m.userId))
      .map((m) => m.userId);

    const splits = createEqualSplits(expense.id, expense.amount, memberIds, expense.paidBy);
    db.expenseSplits.push(...splits);

    // Auto-generate notifications for other members (business rule §9.8)
    for (const memberId of memberIds) {
      if (memberId === me.id) continue;
      db.notifications.push(
        createNotification({
          userId: memberId,
          groupId,
          type: "expense_added",
          expenseId: expense.id,
          isRead: false,
        }),
      );
    }

    return HttpResponse.json({ ...expense, splits }, { status: 201 });
  }),

  // PUT /expenses/:id
  http.put("/api/expenses/:id", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.expenses.findIndex((e) => e.id === params.id);
    if (index === -1) return errorResponse(404, "Gasto no encontrado");

    const body = (await request.json()) as Partial<Expense> & {
      excludeMembers?: string[];
    };
    const old = db.expenses[index];
    db.expenses[index] = { ...old, ...body, id: old.id, groupId: old.groupId };
    const expense = db.expenses[index];

    // If amount changed, recalculate splits
    if (body.amount !== undefined && body.amount !== old.amount) {
      db.expenseSplits = db.expenseSplits.filter((s) => s.expenseId !== expense.id);

      const excluded = new Set(body.excludeMembers ?? []);
      const memberIds = db.groupMembers
        .filter((m) => m.groupId === expense.groupId && !excluded.has(m.userId))
        .map((m) => m.userId);

      const splits = createEqualSplits(expense.id, expense.amount, memberIds, expense.paidBy);
      db.expenseSplits.push(...splits);
    }

    const splits = db.expenseSplits.filter((s) => s.expenseId === expense.id);
    return HttpResponse.json({ ...expense, splits });
  }),

  // DELETE /expenses/:id
  http.delete("/api/expenses/:id", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.expenses.findIndex((e) => e.id === params.id);
    if (index === -1) return errorResponse(404, "Gasto no encontrado");

    const expenseId = db.expenses[index].id;
    db.expenses.splice(index, 1);
    db.expenseSplits = db.expenseSplits.filter((s) => s.expenseId !== expenseId);

    return new HttpResponse(null, { status: 204 });
  }),
];
