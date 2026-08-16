import type { ID, ISODateString } from "./common";

export type InviteMethod = "alias" | "link";
export type InviteStatus = "pending" | "accepted" | "declined";

export interface GroupInvitation {
  id: ID;
  groupId: ID;
  invitedByUserId: ID;
  method: InviteMethod;
  token: string;
  inviteeUserId: ID | null;
  status: InviteStatus;
  createdAt: ISODateString;
}
