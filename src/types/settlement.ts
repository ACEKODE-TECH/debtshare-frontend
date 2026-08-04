import type { CurrencyCode, ID, ISODateString } from "./common";

export type SettlementStatus = "pending" | "completed";

/** A recorded payment between two group members, closing out (part of) a DebtEdge. */
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
