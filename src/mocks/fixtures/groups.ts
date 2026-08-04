import type { Group, GroupMember } from "@/types";

export const groups: Group[] = [
  {
    id: "group_1",
    name: "Viaje a Lisboa",
    description: "Puente de diciembre, del 4 al 7",
    currency: "EUR",
    createdBy: "user_1",
    createdAt: "2025-11-02T09:20:00.000Z",
  },
  {
    id: "group_2",
    name: "Piso Malasaña",
    description: "Gastos fijos del piso compartido",
    currency: "EUR",
    createdBy: "user_2",
    createdAt: "2025-09-15T08:00:00.000Z",
  },
];

export const groupMembers: GroupMember[] = [
  { id: "gm_1", groupId: "group_1", userId: "user_1", role: "owner", joinedAt: "2025-11-02T09:20:00.000Z" },
  { id: "gm_2", groupId: "group_1", userId: "user_2", role: "member", joinedAt: "2025-11-02T09:25:00.000Z" },
  { id: "gm_3", groupId: "group_1", userId: "user_3", role: "member", joinedAt: "2025-11-05T18:41:00.000Z" },
  { id: "gm_4", groupId: "group_2", userId: "user_2", role: "owner", joinedAt: "2025-09-15T08:00:00.000Z" },
  { id: "gm_5", groupId: "group_2", userId: "user_4", role: "member", joinedAt: "2025-12-01T11:05:00.000Z" },
  { id: "gm_6", groupId: "group_2", userId: "user_5", role: "member", joinedAt: "2025-12-01T11:06:00.000Z" },
];
