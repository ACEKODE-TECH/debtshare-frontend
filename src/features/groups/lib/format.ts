const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€",
  USD: "US$",
  GBP: "£",
};

export function currencySymbol(code: string): string {
  return CURRENCY_SYMBOL[code] ?? code;
}

/** e.g. "3,80 €"  or  "US$ 12,00". Sign passed by caller (no forced +/-). */
export function formatAmount(amount: number, currency: string, options: { withSign?: boolean } = {}): string {
  const symbol = currencySymbol(currency);
  const abs = Math.abs(amount);
  const formatter = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const sign = options.withSign ? (amount > 0 ? "+" : amount < 0 ? "−" : "") : "";
  return `${sign}${formatter.format(abs)} ${symbol}`;
}

/** Section header for a feed: "Hoy" · "Ayer" · "MIÉRCOLES 3 SEP" · "MARZO 2025" */
export function formatFeedDateHeader(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (sameDay(d, now)) return "Hoy";
  if (sameDay(d, yesterday)) return "Ayer";

  const sameYear = d.getFullYear() === now.getFullYear();
  if (sameYear) {
    // "Miércoles · 3 sep"
    return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "short" })
      .format(d)
      .replace(",", " ·");
  }
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(d);
}

/** "hace 2 h" · "hace 5 d" · "ayer" · "hoy" · null if no date */
export function formatRelativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const now = Date.now();
  const diffMin = Math.max(0, Math.round((now - then) / 60_000));

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return "ayer";
  if (diffD < 30) return `hace ${diffD} d`;
  const diffMo = Math.round(diffD / 30);
  if (diffMo < 12) return `hace ${diffMo} m`;
  const diffY = Math.round(diffMo / 12);
  return `hace ${diffY} a`;
}
