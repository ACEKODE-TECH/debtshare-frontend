import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";

import { getDb } from "../db";
import { randomDelayMs } from "../utils";

export const categoryHandlers = [
  // GET /categories
  http.get(`/api${ENDPOINTS.CATEGORIES}`, async () => {
    await randomDelayMs();
    return HttpResponse.json(getDb().categories);
  }),
];
