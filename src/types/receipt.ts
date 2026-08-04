import type { CurrencyCode, ID, ISODateString } from "./common";

export type ReceiptStatus = "processing" | "needs_review" | "processed" | "failed";

export interface ReceiptLineItem {
  id: ID;
  receiptId: ID;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number | null;
}

export interface Receipt {
  id: ID;
  groupId: ID;
  /** Set once the receipt has been reviewed and converted into an Expense. */
  expenseId: ID | null;
  merchantName: string;
  merchantTaxId: string | null;
  issuedAt: ISODateString;
  currency: CurrencyCode;
  subtotal: number;
  taxAmount: number;
  total: number;
  imageUrl: string;
  status: ReceiptStatus;
  lineItems: ReceiptLineItem[];
  createdAt: ISODateString;
}
