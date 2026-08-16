import { http, HttpResponse } from "msw";

import type { Settlement } from "@/types";

import { getDb } from "../db";
import { createSettlement } from "../factories";
import { cursorPaginate, errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const settlementHandlers = [
  // GET /groups/:groupId/settlements
  http.get("/api/groups/:groupId/settlements", async ({ request, params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? "20");

    const items = getDb()
      .settlements.filter((s) => s.groupId === params.groupId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return HttpResponse.json(cursorPaginate(items, cursor, limit));
  }),

  // GET /settlements/:id
  http.get("/api/settlements/:id", async ({ params }) => {
    await randomDelayMs();
    const settlement = getDb().settlements.find((s) => s.id === params.id);
    if (!settlement) return errorResponse(404, "Liquidacion no encontrada");
    return HttpResponse.json(settlement);
  }),

  // POST /groups/:groupId/settlements — "settle up"
  http.post("/api/groups/:groupId/settlements", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const groupId = String(params.groupId);
    const body = (await request.json()) as Partial<Settlement>;

    if (!db.groups.find((g) => g.id === groupId)) return errorResponse(404, "Grupo no encontrado");

    const group = db.groups.find((g) => g.id === groupId)!;
    const settlement = createSettlement({
      groupId,
      fromUserId: body.fromUserId!,
      toUserId: body.toUserId!,
      amount: body.amount!,
      currency: body.currency ?? group.currency,
      status: "completed",
      settledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    db.settlements.push(settlement);

    return HttpResponse.json(settlement, { status: 201 });
  }),

  // DELETE /settlements/:id
  http.delete("/api/settlements/:id", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.settlements.findIndex((s) => s.id === params.id);
    if (index === -1) return errorResponse(404, "Liquidacion no encontrada");

    db.settlements.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
