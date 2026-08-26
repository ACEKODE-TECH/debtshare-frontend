import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { CurrencyCode } from "@/types";

export type ExchangeRateResponse = {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
};

export const exchangeRateQueryKey = (from: string, to: string) => ["exchange-rate", from, to] as const;

/**
 * Fetches the conversion rate for `from → to`. Skips when both currencies are
 * the same (rate = 1, no network call). Cached for an hour — rates are
 * simulated in mocks and won't change often when swapped for the real API.
 */
export function useExchangeRate(from: CurrencyCode | undefined, to: CurrencyCode | undefined) {
  return useQuery({
    queryKey: exchangeRateQueryKey(from ?? "", to ?? ""),
    queryFn: () => api.get<ExchangeRateResponse>(`${ENDPOINTS.EXCHANGE_RATES}?from=${from}&to=${to}`),
    enabled: !!from && !!to && from !== to,
    staleTime: 60 * 60 * 1000, // 1h
  });
}

/**
 * Client-side conversion given a rate. Rounds to 2 decimals. Callers that
 * don't have a rate yet should render a fallback ("…").
 */
export function convertAmount(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}
