import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";

import { getDb } from "../db";
import { createReceipt } from "../factories";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

const SIMULATED_OCR_RESULTS = [
  { merchantName: "Mercadona", merchantTaxId: "A46103834", total: 47.82 },
  { merchantName: "Carrefour Express", merchantTaxId: "B82101242", total: 23.11 },
  { merchantName: "Lidl", merchantTaxId: "B60210297", total: 31.56 },
  { merchantName: "Bar Casa Pepe", merchantTaxId: "B12345678", total: 68.4 },
  { merchantName: "Restaurante El Fogon", merchantTaxId: "B87654321", total: 112.9 },
  { merchantName: "Gasolinera Repsol", merchantTaxId: "A28006619", total: 55.02 },
  { merchantName: "Farmacia Gonzalez", merchantTaxId: "A11223344", total: 18.75 },
];

export const receiptHandlers = [
  // GET /receipts?groupId=xxx
  http.get(`/api${ENDPOINTS.RECEIPTS}`, async ({ request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const groupId = url.searchParams.get("groupId");
    const db = getDb();
    const filtered = groupId ? db.receipts.filter((r) => r.groupId === groupId) : db.receipts;

    return HttpResponse.json(filtered);
  }),

  // GET /receipts/:id
  http.get("/api/receipts/:id", async ({ params }) => {
    await randomDelayMs();
    const receipt = getDb().receipts.find((r) => r.id === params.id);
    if (!receipt) return errorResponse(404, "Ticket no encontrado");
    return HttpResponse.json(receipt);
  }),

  // POST /receipts/process — simulated OCR (~2s latency)
  http.post(`/api${ENDPOINTS.RECEIPT_PROCESS}`, async ({ request }) => {
    await randomDelayMs(1500, 2500);
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const formData = await request.formData();
    const groupId = formData.get("groupId") as string;

    if (!groupId || !db.groups.find((g) => g.id === groupId))
      return errorResponse(400, "groupId requerido y debe ser un grupo existente");

    const ocr = SIMULATED_OCR_RESULTS[Math.floor(Math.random() * SIMULATED_OCR_RESULTS.length)];
    const me = db.users[0];

    const receipt = createReceipt({
      groupId,
      merchantName: ocr.merchantName,
      merchantTaxId: ocr.merchantTaxId,
      total: ocr.total,
      issuedAt: new Date().toISOString(),
      status: "needs_review",
      imageUrl: "/mock-assets/receipts/placeholder.jpg",
      createdBy: me.id,
      createdAt: new Date().toISOString(),
    });
    db.receipts.push(receipt);

    return HttpResponse.json(receipt, { status: 201 });
  }),

  // PUT /receipts/:id — confirm review / link to expense
  http.put("/api/receipts/:id", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.receipts.findIndex((r) => r.id === params.id);
    if (index === -1) return errorResponse(404, "Ticket no encontrado");

    const body = (await request.json()) as Record<string, unknown>;
    db.receipts[index] = { ...db.receipts[index], ...body, id: db.receipts[index].id };
    return HttpResponse.json(db.receipts[index]);
  }),

  // DELETE /receipts/:id
  http.delete("/api/receipts/:id", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.receipts.findIndex((r) => r.id === params.id);
    if (index === -1) return errorResponse(404, "Ticket no encontrado");

    db.receipts.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
