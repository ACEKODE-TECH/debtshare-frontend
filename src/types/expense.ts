import type { CurrencyCode, ID, ISODateString } from "./common";
import type { User } from "./user";

export type SplitMethod = "equal" | "exact" | "percentage" | "shares";

export interface Expense {
  id: ID;
  groupId: ID;
  description: string;
  amount: number;
  currency: CurrencyCode;
  categoryId: ID;
  date: ISODateString;
  paidBy: ID;
  createdBy: ID;
  createdAt: ISODateString;
  receiptId: ID | null;
  splitMethod: SplitMethod;
}

/** Feed row: expense enriched with paidBy user, participants and the current user's share. */
export interface ExpenseListItem extends Expense {
  paidByUser: Pick<User, "id" | "name" | "avatarUrl">;
  /** Amount the current user owes for this expense (0 if they didn't participate). */
  myShare: number;
  /** Total number of members the expense was split across. */
  splitCount: number;
  /** Participants of the split, for avatar stack. */
  participants: Pick<User, "id" | "name" | "avatarUrl">[];
}

export interface ExpenseSplit {
  id: ID;
  expenseId: ID;
  userId: ID;
  amount: number;
  shareValue: number | null;
}
