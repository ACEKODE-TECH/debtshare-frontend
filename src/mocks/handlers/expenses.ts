import { http, HttpResponse } from "msw";

import { expenseSplits, expenses } from "../fixtures";
import { errorResponse, paginate, randomDelayMs, shouldSimulateError } from "../utils";

export const expenseHandlers = [
  http.get("/api/groups/:groupId/expenses", async ({ request, params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    const groupExpenses = expenses
      .filter((e) => e.groupId === params.groupId)
      .sort((a, b) => b.date.localeCompare(a.date));

    return HttpResponse.json(paginate(groupExpenses, page, pageSize));
  }),

  http.get("/api/expenses/:id", async ({ params }) => {
    await randomDelayMs();
    const expense = expenses.find((e) => e.id === params.id);
    if (!expense) return errorResponse(404, "Gasto no encontrado");
    const splits = expenseSplits.filter((s) => s.expenseId === expense.id);
    return HttpResponse.json({ ...expense, splits });
  }),
];
