import type { CurrencyCode, ID } from "./common";

/**
 * A user's net position within a group, derived from expenses/splits
 * (never persisted directly). Positive = the group owes this user;
 * negative = this user owes the group.
 */
export interface Balance {
  groupId: ID;
  userId: ID;
  amount: number;
  currency: CurrencyCode;
}

/** One leg of a group's net balances resolved into pairwise transfers, i.e. "who pays whom". */
export interface DebtEdge {
  from: ID;
  to: ID;
  amount: number;
  currency: CurrencyCode;
}
