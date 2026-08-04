import type { CurrencyCode, ID, ISODateString } from "./common";

export type ExpenseCategory =
  "food" | "transport" | "housing" | "leisure" | "utilities" | "shopping" | "health" | "other";

/** How an expense's amount is divided into splits. */
export type SplitMethod = "equal" | "exact" | "percentage" | "shares";

export interface Expense {
  id: ID;
  groupId: ID;
  description: string;
  amount: number;
  currency: CurrencyCode;
  category: ExpenseCategory;
  date: ISODateString;
  paidBy: ID;
  createdBy: ID;
  createdAt: ISODateString;
  receiptId: ID | null;
  splitMethod: SplitMethod;
}

/** One member's share of an expense. Sum of `amount` across an expense's splits must equal Expense.amount. */
export interface ExpenseSplit {
  id: ID;
  expenseId: ID;
  userId: ID;
  amount: number;
  /** Raw input behind `amount` when splitMethod is "percentage" (0-100) or "shares" (relative weight); unused for "equal"/"exact". */
  shareValue: number | null;
  settled: boolean;
}
