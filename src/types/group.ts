import type { CurrencyCode, ID, ISODateString } from "./common";

export type GroupMemberRole = "owner" | "member";

export interface Group {
  id: ID;
  name: string;
  description: string | null;
  currency: CurrencyCode;
  createdBy: ID;
  createdAt: ISODateString;
}

/** Join entity between User and Group: a user's membership in one group. */
export interface GroupMember {
  id: ID;
  groupId: ID;
  userId: ID;
  role: GroupMemberRole;
  joinedAt: ISODateString;
}
