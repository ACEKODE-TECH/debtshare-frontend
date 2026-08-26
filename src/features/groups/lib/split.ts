/**
 * Divide `amount` equally among `memberIds` and hand any leftover cents to
 * `paidByUserId`. Mirrors the mock's `createEqualSplits` and the business rule
 * from `documentacion-funcional-debtshare.md` §9.1: reparto siempre igualitario;
 * los céntimos sobrantes se los queda quien pagó.
 *
 * Returns a Map<userId, amount> — 0 entries not included. Preserves order of
 * `memberIds` for the caller.
 */
export function computeEqualShares(
  amount: number,
  memberIds: string[],
  paidByUserId: string | null,
): Map<string, number> {
  const result = new Map<string, number>();
  if (memberIds.length === 0 || amount <= 0) return result;

  const cents = Math.round(amount * 100);
  const count = memberIds.length;
  const base = Math.floor(cents / count);
  const leftover = cents - base * count;

  for (const userId of memberIds) {
    result.set(userId, base / 100);
  }

  if (leftover > 0) {
    // Prefer the payer if they are included; otherwise fall back to the first
    // included member so the total always reconciles.
    const target = paidByUserId && result.has(paidByUserId) ? paidByUserId : memberIds[0];
    result.set(target, (result.get(target) ?? 0) + leftover / 100);
  }

  return result;
}
