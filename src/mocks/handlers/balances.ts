import { http, HttpResponse } from "msw";

import { computeGroupBalances, settlements, simplifyDebts } from "../fixtures";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const balanceHandlers = [
  http.get("/api/groups/:groupId/balances", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    return HttpResponse.json(computeGroupBalances(String(params.groupId)));
  }),

  http.get("/api/groups/:groupId/debts", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    const balances = computeGroupBalances(String(params.groupId));
    return HttpResponse.json(simplifyDebts(balances));
  }),

  http.get("/api/groups/:groupId/settlements", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    return HttpResponse.json(settlements.filter((s) => s.groupId === params.groupId));
  }),
];
