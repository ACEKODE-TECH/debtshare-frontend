import { faker } from "@faker-js/faker/locale/es";

import type {
  Category,
  Expense,
  ExpenseSplit,
  Group,
  GroupInvitation,
  GroupMember,
  Notification,
  Receipt,
  Settlement,
  User,
} from "@/types";

import {
  createEqualSplits,
  createExpense,
  createGroup,
  createGroupInvitation,
  createGroupMember,
  createNotification,
  createReceipt,
  createSettlement,
  createUser,
  resetSequence,
  SEED_CATEGORIES,
} from "./factories";

// ---------------------------------------------------------------------------
// In-memory store — persists across requests within a browser session but
// resets on page reload. Every handler reads/writes through this object.
// ---------------------------------------------------------------------------

export interface MockDatabase {
  users: User[];
  groups: Group[];
  groupMembers: GroupMember[];
  categories: Category[];
  expenses: Expense[];
  expenseSplits: ExpenseSplit[];
  receipts: Receipt[];
  settlements: Settlement[];
  invitations: GroupInvitation[];
  notifications: Notification[];
}

let db: MockDatabase;

function seed(): MockDatabase {
  resetSequence();
  faker.seed(42);

  // -- Users ----------------------------------------------------------------
  const marta = createUser({
    name: "Marta Sanz",
    alias: "marta.sanz",
    email: "marta.sanz@example.com",
  });
  const diego = createUser({
    name: "Diego Ferrer",
    alias: "diego.ferrer",
    email: "diego.ferrer@example.com",
  });
  const lucia = createUser({
    name: "Lucia Ortega",
    alias: "lucia.ortega",
    email: "lucia.ortega@example.com",
  });
  const pablo = createUser({
    name: "Pablo Reyes",
    alias: "pablo.reyes",
    email: "pablo.reyes@example.com",
  });
  const ines = createUser({
    name: "Ines Cabrera",
    alias: "ines.cabrera",
    email: "ines.cabrera@example.com",
  });
  const users = [marta, diego, lucia, pablo, ines];

  // -- Groups ---------------------------------------------------------------
  const viaje = createGroup({
    name: "Viaje a Lisboa",
    description: "Puente de diciembre, del 4 al 7",
    currency: "EUR",
    icon: "flight",
    createdBy: marta.id,
    createdAt: "2025-11-02T09:20:00.000Z",
  });
  const piso = createGroup({
    name: "Piso Malasaña",
    description: "Gastos fijos del piso compartido",
    currency: "EUR",
    icon: "home",
    createdBy: diego.id,
    createdAt: "2025-09-15T08:00:00.000Z",
  });
  const groups = [viaje, piso];

  // -- Group members --------------------------------------------------------
  const groupMembers = [
    createGroupMember({ groupId: viaje.id, userId: marta.id, joinedAt: "2025-11-02T09:20:00.000Z" }),
    createGroupMember({ groupId: viaje.id, userId: diego.id, joinedAt: "2025-11-02T09:25:00.000Z" }),
    createGroupMember({ groupId: viaje.id, userId: lucia.id, joinedAt: "2025-11-05T18:41:00.000Z" }),
    createGroupMember({ groupId: piso.id, userId: diego.id, joinedAt: "2025-09-15T08:00:00.000Z" }),
    createGroupMember({ groupId: piso.id, userId: pablo.id, joinedAt: "2025-12-01T11:05:00.000Z" }),
    createGroupMember({ groupId: piso.id, userId: ines.id, joinedAt: "2025-12-01T11:06:00.000Z" }),
  ];

  // -- Categories -----------------------------------------------------------
  const categories = [...SEED_CATEGORIES];

  // -- Expenses + Splits ----------------------------------------------------
  const viajeMembers = [marta.id, diego.id, lucia.id];
  const pisoMembers = [diego.id, pablo.id, ines.id];

  const exp1 = createExpense({
    groupId: viaje.id,
    description: "Vuelos Madrid-Lisboa",
    amount: 342,
    categoryId: "cat_transport",
    date: "2025-11-10T00:00:00.000Z",
    paidBy: marta.id,
    createdBy: marta.id,
    createdAt: "2025-11-10T20:12:00.000Z",
  });
  const exp2 = createExpense({
    groupId: viaje.id,
    description: "Apartamento Airbnb (3 noches)",
    amount: 280,
    categoryId: "cat_housing",
    date: "2025-11-12T00:00:00.000Z",
    paidBy: diego.id,
    createdBy: diego.id,
    createdAt: "2025-11-12T10:03:00.000Z",
  });
  const exp3 = createExpense({
    groupId: viaje.id,
    description: "Cena en Time Out Market",
    amount: 96.5,
    categoryId: "cat_food",
    date: "2025-12-04T21:30:00.000Z",
    paidBy: lucia.id,
    createdBy: lucia.id,
    createdAt: "2025-12-04T22:47:00.000Z",
  });
  const exp4 = createExpense({
    groupId: viaje.id,
    description: "Taxis aeropuerto",
    amount: 38.2,
    categoryId: "cat_transport",
    date: "2025-12-07T08:15:00.000Z",
    paidBy: marta.id,
    createdBy: marta.id,
    createdAt: "2025-12-07T08:20:00.000Z",
  });
  const exp5 = createExpense({
    groupId: piso.id,
    description: "Alquiler diciembre",
    amount: 1050,
    categoryId: "cat_housing",
    date: "2025-12-01T00:00:00.000Z",
    paidBy: diego.id,
    createdBy: diego.id,
    createdAt: "2025-12-01T09:00:00.000Z",
  });
  const exp6 = createExpense({
    groupId: piso.id,
    description: "Luz y gas (Naturgy)",
    amount: 128.4,
    categoryId: "cat_utilities",
    date: "2025-12-03T00:00:00.000Z",
    paidBy: pablo.id,
    createdBy: pablo.id,
    createdAt: "2025-12-03T19:22:00.000Z",
  });
  const exp7 = createExpense({
    groupId: piso.id,
    description: "Compra semanal Mercadona",
    amount: 63.75,
    categoryId: "cat_food",
    date: "2025-12-06T00:00:00.000Z",
    paidBy: ines.id,
    createdBy: ines.id,
    createdAt: "2025-12-06T18:05:00.000Z",
  });
  const exp8 = createExpense({
    groupId: piso.id,
    description: "Internet fibra",
    amount: 39.9,
    categoryId: "cat_utilities",
    date: "2025-12-05T00:00:00.000Z",
    paidBy: diego.id,
    createdBy: diego.id,
    createdAt: "2025-12-05T09:41:00.000Z",
  });

  const expenses = [exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8];

  const expenseSplits = [
    ...createEqualSplits(exp1.id, exp1.amount, viajeMembers, exp1.paidBy),
    ...createEqualSplits(exp2.id, exp2.amount, viajeMembers, exp2.paidBy),
    ...createEqualSplits(exp3.id, exp3.amount, viajeMembers, exp3.paidBy),
    ...createEqualSplits(exp4.id, exp4.amount, viajeMembers, exp4.paidBy),
    ...createEqualSplits(exp5.id, exp5.amount, pisoMembers, exp5.paidBy),
    ...createEqualSplits(exp6.id, exp6.amount, pisoMembers, exp6.paidBy),
    ...createEqualSplits(exp7.id, exp7.amount, pisoMembers, exp7.paidBy),
    ...createEqualSplits(exp8.id, exp8.amount, pisoMembers, exp8.paidBy),
  ];

  // -- Receipts -------------------------------------------------------------
  const receipt1 = createReceipt({
    groupId: piso.id,
    expenseId: exp7.id,
    merchantName: "Mercadona",
    merchantTaxId: "A46103834",
    issuedAt: "2025-12-06T17:48:00.000Z",
    total: 63.75,
    status: "processed",
    createdBy: ines.id,
    createdAt: "2025-12-06T18:00:00.000Z",
  });
  const receipt2 = createReceipt({
    groupId: viaje.id,
    expenseId: exp3.id,
    merchantName: "Time Out Market Lisboa",
    merchantTaxId: "PT503999214",
    issuedAt: "2025-12-04T21:24:00.000Z",
    total: 96.5,
    status: "processed",
    createdBy: lucia.id,
    createdAt: "2025-12-04T22:40:00.000Z",
  });
  const receipt3 = createReceipt({
    groupId: piso.id,
    expenseId: null,
    merchantName: "Carrefour Express",
    merchantTaxId: "B82101242",
    issuedAt: "2025-12-08T13:10:00.000Z",
    total: 23.11,
    status: "needs_review",
    createdBy: pablo.id,
    createdAt: "2025-12-08T13:15:00.000Z",
  });

  // Link receipts back to expenses
  exp7.receiptId = receipt1.id;
  exp3.receiptId = receipt2.id;

  const receipts = [receipt1, receipt2, receipt3];

  // -- Settlements ----------------------------------------------------------
  const settlement1 = createSettlement({
    groupId: viaje.id,
    fromUserId: lucia.id,
    toUserId: marta.id,
    amount: 114,
    status: "completed",
    settledAt: "2025-12-08T10:00:00.000Z",
    createdAt: "2025-12-08T09:55:00.000Z",
  });
  const settlement2 = createSettlement({
    groupId: piso.id,
    fromUserId: ines.id,
    toUserId: diego.id,
    amount: 350,
    status: "pending",
    settledAt: null,
    createdAt: "2025-12-09T12:00:00.000Z",
  });
  const settlements = [settlement1, settlement2];

  // -- Invitations ----------------------------------------------------------
  const inv1 = createGroupInvitation({
    groupId: viaje.id,
    invitedByUserId: marta.id,
    method: "alias",
    inviteeUserId: pablo.id,
    status: "pending",
  });
  const inv2 = createGroupInvitation({
    groupId: piso.id,
    invitedByUserId: diego.id,
    method: "link",
    status: "pending",
  });
  const inv3 = createGroupInvitation({
    groupId: viaje.id,
    invitedByUserId: marta.id,
    method: "alias",
    inviteeUserId: lucia.id,
    status: "accepted",
  });
  const invitations = [inv1, inv2, inv3];

  // -- Notifications --------------------------------------------------------
  const notifications: Notification[] = [
    // Activity: new expenses added to groups where marta is member
    createNotification({
      userId: marta.id,
      groupId: viaje.id,
      type: "expense_added",
      expenseId: exp2.id,
      isRead: true,
    }),
    createNotification({
      userId: marta.id,
      groupId: viaje.id,
      type: "expense_added",
      expenseId: exp3.id,
      isRead: false,
    }),
    // Invitation received by pablo
    createNotification({
      userId: pablo.id,
      groupId: viaje.id,
      type: "invitation_received",
      invitationId: inv1.id,
      isRead: false,
    }),
    // Activity for diego
    createNotification({
      userId: diego.id,
      groupId: piso.id,
      type: "expense_added",
      expenseId: exp6.id,
      isRead: false,
    }),
    createNotification({
      userId: diego.id,
      groupId: piso.id,
      type: "expense_added",
      expenseId: exp7.id,
      isRead: true,
    }),
    createNotification({
      userId: diego.id,
      groupId: viaje.id,
      type: "expense_added",
      expenseId: exp3.id,
      isRead: false,
    }),
  ];

  return {
    users,
    groups,
    groupMembers,
    categories,
    expenses,
    expenseSplits,
    receipts,
    settlements,
    invitations,
    notifications,
  };
}

// -- Public API -------------------------------------------------------------

export function getDb(): MockDatabase {
  if (!db) db = seed();
  return db;
}

export function resetDb(): MockDatabase {
  db = seed();
  return db;
}

export function getCurrentUser(): User {
  return getDb().users[0];
}
