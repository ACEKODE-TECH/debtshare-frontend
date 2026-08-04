import { http, HttpResponse } from "msw";

import { receipts } from "../fixtures";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const receiptHandlers = [
  http.get("/api/receipts", async ({ request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const groupId = url.searchParams.get("groupId");
    const filtered = groupId ? receipts.filter((r) => r.groupId === groupId) : receipts;

    return HttpResponse.json(filtered);
  }),

  http.get("/api/receipts/:id", async ({ params }) => {
    await randomDelayMs();
    const receipt = receipts.find((r) => r.id === params.id);
    if (!receipt) return errorResponse(404, "Ticket no encontrado");
    return HttpResponse.json(receipt);
  }),
];
