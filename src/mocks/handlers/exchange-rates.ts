import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";

import { randomDelayMs } from "../utils";

const RATES: Record<string, Record<string, number>> = {
  EUR: { EUR: 1, USD: 1.085, GBP: 0.857 },
  USD: { EUR: 0.922, USD: 1, GBP: 0.79 },
  GBP: { EUR: 1.167, USD: 1.266, GBP: 1 },
};

export const exchangeRateHandlers = [
  // GET /exchange-rates?from=EUR&to=USD
  http.get(`/api${ENDPOINTS.EXCHANGE_RATES}`, async ({ request }) => {
    await randomDelayMs();

    const url = new URL(request.url);
    const from = url.searchParams.get("from")?.toUpperCase() ?? "EUR";
    const to = url.searchParams.get("to")?.toUpperCase();

    if (to) {
      const rate = RATES[from]?.[to];
      if (rate === undefined) {
        return HttpResponse.json({ message: `Par de divisas no soportado: ${from}/${to}` }, { status: 400 });
      }
      return HttpResponse.json({ from, to, rate });
    }

    return HttpResponse.json({
      base: from,
      rates: RATES[from] ?? {},
    });
  }),
];
