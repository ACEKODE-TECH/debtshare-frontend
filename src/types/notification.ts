import type { ID, ISODateString } from "./common";

export type NotificationType = "expense_added" | "invitation_received";

export interface Notification {
  id: ID;
  userId: ID;
  type: NotificationType;
  groupId: ID;
  expenseId: ID | null;
  invitationId: ID | null;
  isRead: boolean;
  createdAt: ISODateString;
}
