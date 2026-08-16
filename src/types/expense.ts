import type { CurrencyCode, ID, ISODateString } from "./common";

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

export interface ExpenseSplit {
  id: ID;
  expenseId: ID;
  userId: ID;
  amount: number;
  shareValue: number | null;
}
