import type { CurrencyCode, ID, ISODateString } from "./common";

export type SettlementStatus = "pending" | "completed";

export interface Settlement {
  id: ID;
  groupId: ID;
  fromUserId: ID;
  toUserId: ID;
  amount: number;
  currency: CurrencyCode;
  status: SettlementStatus;
  settledAt: ISODateString | null;
  createdAt: ISODateString;
}
