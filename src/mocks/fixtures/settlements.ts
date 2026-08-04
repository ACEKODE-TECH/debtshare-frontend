import type { Settlement } from "@/types";

export const settlements: Settlement[] = [
  {
    id: "settlement_1",
    groupId: "group_1",
    fromUserId: "user_3",
    toUserId: "user_1",
    amount: 114,
    currency: "EUR",
    status: "completed",
    settledAt: "2025-12-08T10:00:00.000Z",
    createdAt: "2025-12-08T09:55:00.000Z",
  },
  {
    id: "settlement_2",
    groupId: "group_2",
    fromUserId: "user_5",
    toUserId: "user_2",
    amount: 350,
    currency: "EUR",
    status: "pending",
    settledAt: null,
    createdAt: "2025-12-09T12:00:00.000Z",
  },
];
