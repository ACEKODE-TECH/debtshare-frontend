import { faker } from "@faker-js/faker/locale/es";

import type {
  Category,
  CurrencyCode,
  Expense,
  ExpenseSplit,
  Group,
  GroupInvitation,
  GroupMember,
  InviteMethod,
  InviteStatus,
  Notification,
  NotificationType,
  Receipt,
  ReceiptStatus,
  Settlement,
  SettlementStatus,
  SplitMethod,
  User,
} from "@/types";

let seq = 0;
function nextId(prefix: string): string {
  seq += 1;
  return `${prefix}_${seq}`;
}

export function resetSequence(): void {
  seq = 0;
}

// -- User -------------------------------------------------------------------

const GROUP_ICONS = ["flight", "home", "beach", "mountain", "city", "food", "music", "sports", "car", "tent"];

const SPANISH_MERCHANTS = [
  { name: "Mercadona", taxId: "A46103834" },
  { name: "Carrefour Express", taxId: "B82101242" },
  { name: "Lidl", taxId: "B60210297" },
  { name: "Dia", taxId: "A28164754" },
  { name: "El Corte Ingles", taxId: "A28017895" },
  { name: "Alcampo", taxId: "A28581882" },
  { name: "Consum", taxId: "F46078986" },
  { name: "BonArea", taxId: "A25004855" },
  { name: "Telepizza", taxId: "A79707345" },
  { name: "Bar Casa Pepe", taxId: "B12345678" },
  { name: "Restaurante El Fogon", taxId: "B87654321" },
  { name: "Farmacia Gonzalez", taxId: "A11223344" },
  { name: "Gasolinera Repsol", taxId: "A28006619" },
  { name: "Zara", taxId: "A15075062" },
  { name: "Decathlon", taxId: "A79935607" },
];

export function createUser(overrides: Partial<User> = {}): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: nextId("user"),
    name: `${firstName} ${lastName}`,
    alias: faker.internet
      .username({ firstName, lastName })
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, ""),
    email: faker.internet.email({ firstName, lastName, provider: "example.com" }).toLowerCase(),
    avatarUrl: faker.helpers.maybe(() => faker.image.avatar(), { probability: 0.4 }) ?? null,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,
  };
}

// -- Category ---------------------------------------------------------------

export const SEED_CATEGORIES: Category[] = [
  { id: "cat_food", name: "Comida", icon: "utensils" },
  { id: "cat_transport", name: "Transporte", icon: "car" },
  { id: "cat_housing", name: "Alojamiento", icon: "house" },
  { id: "cat_leisure", name: "Ocio", icon: "gamepad" },
  { id: "cat_utilities", name: "Suministros", icon: "zap" },
  { id: "cat_shopping", name: "Compras", icon: "shopping-bag" },
  { id: "cat_health", name: "Salud", icon: "heart-pulse" },
  { id: "cat_other", name: "Otros", icon: "ellipsis" },
];

// -- Group ------------------------------------------------------------------

export function createGroup(overrides: Partial<Group> = {}): Group {
  return {
    id: nextId("group"),
    name: faker.helpers.arrayElement([
      "Viaje a Lisboa",
      "Piso Malasaña",
      "Finde en Asturias",
      "Erasmus Berlin",
      "Cena de cumpleaños",
      "Vacaciones Mallorca",
      "Compra semanal",
      "Roadtrip Portugal",
    ]),
    description: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }) ?? null,
    currency: "EUR" as CurrencyCode,
    icon: faker.helpers.arrayElement(GROUP_ICONS),
    createdBy: "",
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,
  };
}

// -- GroupMember -------------------------------------------------------------

export function createGroupMember(
  overrides: Partial<GroupMember> & Pick<GroupMember, "groupId" | "userId">,
): GroupMember {
  return {
    id: nextId("gm"),
    joinedAt: faker.date.past({ years: 1 }).toISOString(),
    ...overrides,
  };
}

// -- Expense ----------------------------------------------------------------

const EXPENSE_DESCRIPTIONS: Record<string, string[]> = {
  cat_food: [
    "Compra semanal Mercadona",
    "Cena en Casa Lucio",
    "Desayuno cafeteria",
    "Comida para llevar",
    "Cervezas en el bar",
    "Brunch dominical",
  ],
  cat_transport: [
    "Vuelos ida y vuelta",
    "Taxi al aeropuerto",
    "Gasolina viaje",
    "Billete AVE",
    "Uber al centro",
    "Parking centro comercial",
  ],
  cat_housing: ["Alquiler mensual", "Airbnb 3 noches", "Hotel centro", "Alquiler apartamento"],
  cat_leisure: [
    "Entradas concierto",
    "Cine y palomitas",
    "Escape room",
    "Alquiler kayaks",
    "Museo Reina Sofia",
  ],
  cat_utilities: ["Luz y gas (Naturgy)", "Internet fibra", "Agua trimestre", "Seguro hogar"],
  cat_shopping: ["Detergente y limpieza", "Ropa para el viaje", "Souvenirs"],
  cat_health: ["Farmacia", "Protector solar", "Botiquin viaje"],
  cat_other: ["Propinas", "Fotocopias", "Llaves extra"],
};

export function createExpense(overrides: Partial<Expense> & Pick<Expense, "groupId" | "paidBy">): Expense {
  const categoryId = overrides.categoryId ?? faker.helpers.arrayElement(SEED_CATEGORIES).id;
  const descriptions = EXPENSE_DESCRIPTIONS[categoryId] ?? EXPENSE_DESCRIPTIONS.cat_other;
  return {
    id: nextId("exp"),
    description: faker.helpers.arrayElement(descriptions),
    amount: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
    currency: "EUR" as CurrencyCode,
    categoryId,
    date: faker.date.recent({ days: 60 }).toISOString(),
    createdBy: overrides.paidBy,
    createdAt: faker.date.recent({ days: 60 }).toISOString(),
    receiptId: null,
    splitMethod: "equal" as SplitMethod,
    ...overrides,
  };
}

// -- ExpenseSplit -----------------------------------------------------------

/**
 * Splits `amount` equally among `memberIds`, assigning leftover cents to
 * `paidByUserId` per business rule §9.1.
 */
export function createEqualSplits(
  expenseId: string,
  amount: number,
  memberIds: string[],
  paidByUserId: string,
): ExpenseSplit[] {
  const count = memberIds.length;
  const baseAmount = Math.floor((amount * 100) / count) / 100;
  const totalBase = Math.round(baseAmount * count * 100) / 100;
  const remainder = Math.round((amount - totalBase) * 100) / 100;

  return memberIds.map((userId) => ({
    id: nextId("split"),
    expenseId,
    userId,
    amount: userId === paidByUserId ? baseAmount + remainder : baseAmount,
    shareValue: null,
  }));
}

// -- Receipt ----------------------------------------------------------------

export function createReceipt(overrides: Partial<Receipt> & Pick<Receipt, "groupId" | "createdBy">): Receipt {
  const merchant = faker.helpers.arrayElement(SPANISH_MERCHANTS);
  return {
    id: nextId("receipt"),
    expenseId: null,
    merchantName: merchant.name,
    merchantTaxId: merchant.taxId,
    issuedAt: faker.date.recent({ days: 30 }).toISOString(),
    currency: "EUR" as CurrencyCode,
    total: parseFloat(faker.commerce.price({ min: 8, max: 200, dec: 2 })),
    imageUrl: "/mock-assets/receipts/placeholder.jpg",
    status: "processed" as ReceiptStatus,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    ...overrides,
  };
}

// -- Settlement -------------------------------------------------------------

export function createSettlement(
  overrides: Partial<Settlement> & Pick<Settlement, "groupId" | "fromUserId" | "toUserId" | "amount">,
): Settlement {
  const status: SettlementStatus = overrides.status ?? "completed";
  return {
    id: nextId("settlement"),
    currency: "EUR" as CurrencyCode,
    status,
    settledAt: status === "completed" ? faker.date.recent({ days: 7 }).toISOString() : null,
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
    ...overrides,
  };
}

// -- GroupInvitation --------------------------------------------------------

export function createGroupInvitation(
  overrides: Partial<GroupInvitation> & Pick<GroupInvitation, "groupId" | "invitedByUserId">,
): GroupInvitation {
  const method: InviteMethod = overrides.method ?? faker.helpers.arrayElement(["alias", "link"]);
  return {
    id: nextId("inv"),
    method,
    token: faker.string.nanoid(12),
    inviteeUserId: method === "alias" ? (overrides.inviteeUserId ?? null) : null,
    status: "pending" as InviteStatus,
    createdAt: faker.date.recent({ days: 14 }).toISOString(),
    ...overrides,
  };
}

// -- Notification -----------------------------------------------------------

export function createNotification(
  overrides: Partial<Notification> & Pick<Notification, "userId" | "groupId">,
): Notification {
  const type: NotificationType =
    overrides.type ?? faker.helpers.arrayElement(["expense_added", "invitation_received"]);
  return {
    id: nextId("notif"),
    type,
    expenseId: type === "expense_added" ? (overrides.expenseId ?? null) : null,
    invitationId: type === "invitation_received" ? (overrides.invitationId ?? null) : null,
    isRead: faker.datatype.boolean({ probability: 0.4 }),
    createdAt: faker.date.recent({ days: 14 }).toISOString(),
    ...overrides,
  };
}
