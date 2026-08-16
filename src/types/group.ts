import type { CurrencyCode, ID, ISODateString } from "./common";

export interface Group {
  id: ID;
  name: string;
  description: string | null;
  currency: CurrencyCode;
  icon: string;
  createdBy: ID;
  createdAt: ISODateString;
}

export interface GroupMember {
  id: ID;
  groupId: ID;
  userId: ID;
  joinedAt: ISODateString;
}
