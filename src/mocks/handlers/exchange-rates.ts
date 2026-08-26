import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";
import type { CurrencyCode } from "@/types";

import { RATES } from "../exchange";
import { randomDelayMs } from "../utils";

export const exchangeRateHandlers = [
  // GET /exchange-rates?from=EUR&to=USD
  http.get(`/api${ENDPOINTS.EXCHANGE_RATES}`, async ({ request }) => {
    await randomDelayMs();

    const url = new URL(request.url);
    const from = (url.searchParams.get("from")?.toUpperCase() ?? "EUR") as CurrencyCode;
    const to = url.searchParams.get("to")?.toUpperCase() as CurrencyCode | undefined;

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
