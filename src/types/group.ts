import type { CurrencyCode, ID, ISODateString } from "./common";
import type { User } from "./user";

export interface Group {
  id: ID;
  name: string;
  description: string | null;
  currency: CurrencyCode;
  icon: string;
  createdBy: ID;
  createdAt: ISODateString;
}

export type GroupStatus = "active" | "settled";

export interface GroupSummary extends Group {
  memberCount: number;
  expenseCount: number;
  totalExpenses: number;
  /** Signed balance of the current user in the group, in the group's currency. */
  myBalance: number;
  status: GroupStatus;
  lastActivityAt: ISODateString | null;
  /** First few members for avatar stack (creator first, then others). */
  memberPreview: Pick<User, "id" | "name" | "avatarUrl">[];
}

export interface CreateGroupRequest {
  name: string;
  description: string | null;
  currency: CurrencyCode;
  icon: string;
}

export interface GroupMember {
  id: ID;
  groupId: ID;
  userId: ID;
  joinedAt: ISODateString;
}
