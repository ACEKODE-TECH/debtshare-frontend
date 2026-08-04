import { HttpResponse } from "msw";

/** Simulates real network latency so loading states are actually exercised. */
export function randomDelayMs(min = 300, max = 900): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fails roughly `rate` of the time, for exercising error states.
 * Only active when VITE_ENABLE_MOCK_ERRORS=true — off by default so
 * development isn't interrupted and tests stay deterministic.
 */
export function shouldSimulateError(rate = 0.08): boolean {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_ENABLE_MOCK_ERRORS !== "true") return false;
  return Math.random() < rate;
}

export function errorResponse(
  status = 500,
  message = "Ha ocurrido un error inesperado. Intentalo de nuevo.",
) {
  return HttpResponse.json({ message }, { status });
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const start = (page - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);
  return {
    items: pagedItems,
    page,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}
