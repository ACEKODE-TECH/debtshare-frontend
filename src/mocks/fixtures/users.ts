import type { User } from "@/types";

export const users: User[] = [
  {
    id: "user_1",
    name: "Marta Sanz",
    email: "marta.sanz@example.com",
    avatarUrl: null,
    createdAt: "2025-11-02T09:14:00.000Z",
  },
  {
    id: "user_2",
    name: "Diego Ferrer",
    email: "diego.ferrer@example.com",
    avatarUrl: null,
    createdAt: "2025-11-02T09:15:00.000Z",
  },
  {
    id: "user_3",
    name: "Lucia Ortega",
    email: "lucia.ortega@example.com",
    avatarUrl: null,
    createdAt: "2025-11-05T18:40:00.000Z",
  },
  {
    id: "user_4",
    name: "Pablo Reyes",
    email: "pablo.reyes@example.com",
    avatarUrl: null,
    createdAt: "2025-12-01T11:02:00.000Z",
  },
  {
    id: "user_5",
    name: "Ines Cabrera",
    email: "ines.cabrera@example.com",
    avatarUrl: null,
    createdAt: "2025-12-01T11:03:00.000Z",
  },
];

/** Stand-in for the authenticated user until the auth feature exists. */
export const currentUser: User = users[0];
