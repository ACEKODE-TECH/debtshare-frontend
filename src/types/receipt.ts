import type { CurrencyCode, ID, ISODateString } from "./common";

export type ReceiptStatus = "processing" | "needs_review" | "processed" | "failed";

export interface Receipt {
  id: ID;
  groupId: ID;
  expenseId: ID | null;
  merchantName: string;
  merchantTaxId: string | null;
  issuedAt: ISODateString;
  currency: CurrencyCode;
  total: number;
  imageUrl: string;
  status: ReceiptStatus;
  createdBy: ID;
  createdAt: ISODateString;
}
