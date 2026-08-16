import { HttpResponse } from "msw";

export function randomDelayMs(min = 300, max = 900): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shouldSimulateError(rate = 0.04): boolean {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_ENABLE_MOCK_ERRORS !== "true") return false;
  return Math.random() < rate;
}

export function errorResponse(
  status = 500,
  message = "Ha ocurrido un error inesperado. Intentalo de nuevo.",
) {
  return HttpResponse.json({ message }, { status });
}

// -- Cursor-based pagination ------------------------------------------------

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export function cursorPaginate<T extends { id: string }>(
  items: T[],
  cursor: string | null,
  limit: number,
): CursorPage<T> {
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = items.findIndex((item) => item.id === cursor);
    startIndex = cursorIndex === -1 ? 0 : cursorIndex + 1;
  }

  const page = items.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < items.length;
  const nextCursor = hasMore ? page[page.length - 1].id : null;

  return { items: page, nextCursor, hasMore, total: items.length };
}
