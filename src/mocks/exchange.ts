import type { CurrencyCode } from "@/types";

/**
 * Simulated fx rates used by both the /exchange-rates handler and any mock
 * aggregation that needs to convert cross-currency amounts (group summary
 * totals, per-user balances, etc.). When the real backend is ready, all
 * conversions should happen server-side — this table then becomes irrelevant.
 */
export const RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  EUR: { EUR: 1, USD: 1.085, GBP: 0.857 },
  USD: { EUR: 0.922, USD: 1, GBP: 0.79 },
  GBP: { EUR: 1.167, USD: 1.266, GBP: 1 },
};

export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const rate = RATES[from]?.[to] ?? 1;
  return Math.round(amount * rate * 100) / 100;
}
