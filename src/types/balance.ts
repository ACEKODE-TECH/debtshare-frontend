import type { CurrencyCode, ID } from "./common";
import type { User } from "./user";

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

export interface BalanceWithUser extends Balance {
  user: Pick<User, "id" | "name" | "avatarUrl"> | null;
}

/** One leg of a group's net balances resolved into pairwise transfers, i.e. "who pays whom". */
export interface DebtEdge {
  from: ID;
  to: ID;
  amount: number;
  currency: CurrencyCode;
}
