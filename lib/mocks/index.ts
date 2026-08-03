import { Home, PartyPopper, TrainFront, UtensilsCrossed } from "lucide-react";
import type {
  Balance,
  Category,
  Expense,
  ExpenseShare,
  Group,
  TicketScan,
  User,
} from "@/lib/types";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* Usuarios                                                            */
/* ------------------------------------------------------------------ */

export const users: User[] = [
  { id: "usr-ana", name: "Ana García", email: "ana.garcia@example.com", avatarColor: "bg-amber-600" },
  { id: "usr-luis", name: "Luis Fernández", email: "luis.fernandez@example.com", avatarColor: "bg-stone-700" },
  { id: "usr-carmen", name: "Carmen Ruiz", email: "carmen.ruiz@example.com", avatarColor: "bg-stone-500" },
  { id: "usr-pedro", name: "Pedro Sánchez", email: "pedro.sanchez@example.com", avatarColor: "bg-amber-500" },
];

/* ------------------------------------------------------------------ */
/* Categorías                                                          */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  { id: "cat-food", name: "Comida", icon: UtensilsCrossed, color: "text-amber-600" },
  { id: "cat-transport", name: "Transporte", icon: TrainFront, color: "text-sky-600" },
  { id: "cat-leisure", name: "Ocio", icon: PartyPopper, color: "text-violet-600" },
  { id: "cat-home", name: "Hogar", icon: Home, color: "text-emerald-600" },
];

/* ------------------------------------------------------------------ */
/* Grupos                                                              */
/* ------------------------------------------------------------------ */

const PORTO = ["usr-ana", "usr-luis", "usr-carmen", "usr-pedro"];
const BIRTHDAY = ["usr-carmen", "usr-ana", "usr-luis", "usr-pedro"];
const FLAT = ["usr-ana", "usr-luis", "usr-carmen"];

export const groups: Group[] = [
  {
    id: "grp-porto",
    name: "Viaje a Porto",
    description: "Puente de mayo — 4 días en Oporto",
    emoji: "🚊",
    currency: "EUR",
    createdAt: "2026-04-02T18:30:00.000Z",
    members: PORTO.map((userId) => ({
      userId,
      groupId: "grp-porto",
      role: userId === "usr-ana" ? ("admin" as const) : ("member" as const),
      joinedAt: "2026-04-02T18:30:00.000Z",
    })),
  },
  {
    id: "grp-birthday",
    name: "Cena cumpleaños Carmen",
    description: "Cena y celebración del cumpleaños de Carmen",
    emoji: "🎂",
    currency: "EUR",
    createdAt: "2026-06-28T10:00:00.000Z",
    members: BIRTHDAY.map((userId) => ({
      userId,
      groupId: "grp-birthday",
      role: userId === "usr-carmen" ? ("admin" as const) : ("member" as const),
      joinedAt: "2026-06-28T10:00:00.000Z",
    })),
  },
  {
    id: "grp-flat",
    name: "Piso compartido",
    description: "Gastos del piso de Ana, Luis y Carmen",
    emoji: "🏠",
    currency: "EUR",
    createdAt: "2026-04-20T09:15:00.000Z",
    members: FLAT.map((userId) => ({
      userId,
      groupId: "grp-flat",
      role: userId === "usr-luis" ? ("admin" as const) : ("member" as const),
      joinedAt: "2026-04-20T09:15:00.000Z",
    })),
  },
];

/* ------------------------------------------------------------------ */
/* Gastos                                                              */
/* ------------------------------------------------------------------ */

/** Divide un total en partes iguales, exacto al céntimo (resto repartido entre los primeros). */
function equalShares(total: number, userIds: string[]): ExpenseShare[] {
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / userIds.length);
  const remainder = cents % userIds.length;
  return userIds.map((userId, i) => ({
    userId,
    amount: (base + (i < remainder ? 1 : 0)) / 100,
  }));
}

/** Construye las partes a partir de un mapa { userId: amount }. */
function sharesOf(shares: Record<string, number>): ExpenseShare[] {
  return Object.entries(shares).map(([userId, amount]) => ({ userId, amount }));
}

const portoExpenses: Expense[] = [
  {
    id: "exp-porto-01",
    groupId: "grp-porto",
    description: "Tren AVE Madrid–Porto",
    amount: 120,
    categoryId: "cat-transport",
    paidBy: "usr-ana",
    date: "2026-05-01T08:12:00.000Z",
    splitType: "equal",
    shares: equalShares(120, PORTO),
    createdAt: "2026-05-01T08:15:00.000Z",
  },
  {
    id: "exp-porto-02",
    groupId: "grp-porto",
    description: "Apartamento 3 noches",
    amount: 420,
    categoryId: "cat-home",
    paidBy: "usr-carmen",
    date: "2026-05-01T15:30:00.000Z",
    splitType: "equal",
    shares: equalShares(420, PORTO),
    createdAt: "2026-05-01T15:35:00.000Z",
  },
  {
    id: "exp-porto-03",
    groupId: "grp-porto",
    description: "Taxi del aeropuerto",
    amount: 24,
    categoryId: "cat-transport",
    paidBy: "usr-pedro",
    date: "2026-05-01T16:40:00.000Z",
    splitType: "equal",
    shares: equalShares(24, PORTO),
    createdAt: "2026-05-01T16:42:00.000Z",
  },
  {
    id: "exp-porto-04",
    groupId: "grp-porto",
    description: "Supermercado de provisiones",
    amount: 58.4,
    categoryId: "cat-food",
    paidBy: "usr-carmen",
    date: "2026-05-02T11:05:00.000Z",
    splitType: "equal",
    shares: equalShares(58.4, PORTO),
    createdAt: "2026-05-02T11:20:00.000Z",
  },
  {
    id: "exp-porto-05",
    groupId: "grp-porto",
    description: "Torre dos Clérigos",
    amount: 32,
    categoryId: "cat-leisure",
    paidBy: "usr-ana",
    date: "2026-05-02T14:00:00.000Z",
    splitType: "equal",
    shares: equalShares(32, PORTO),
    createdAt: "2026-05-02T14:10:00.000Z",
  },
  {
    id: "exp-porto-06",
    groupId: "grp-porto",
    description: "Cena con fado",
    amount: 84,
    categoryId: "cat-food",
    paidBy: "usr-luis",
    date: "2026-05-02T21:30:00.000Z",
    splitType: "equal",
    shares: equalShares(84, PORTO),
    createdAt: "2026-05-02T21:45:00.000Z",
  },
  {
    id: "exp-porto-07",
    groupId: "grp-porto",
    description: "Crucero por el Duero",
    amount: 88,
    categoryId: "cat-leisure",
    paidBy: "usr-pedro",
    date: "2026-05-03T10:15:00.000Z",
    splitType: "equal",
    shares: equalShares(88, PORTO),
    createdAt: "2026-05-03T10:20:00.000Z",
  },
  {
    id: "exp-porto-08",
    groupId: "grp-porto",
    description: "Degustación de vinos en Vila Nova",
    amount: 45,
    categoryId: "cat-leisure",
    paidBy: "usr-ana",
    date: "2026-05-03T18:00:00.000Z",
    splitType: "custom",
    shares: sharesOf({ "usr-ana": 15, "usr-carmen": 15, "usr-pedro": 15, "usr-luis": 0 }),
    createdAt: "2026-05-03T18:30:00.000Z",
  },
  {
    id: "exp-porto-09",
    groupId: "grp-porto",
    description: "Bus urbano",
    amount: 12,
    categoryId: "cat-transport",
    paidBy: "usr-luis",
    date: "2026-05-03T19:00:00.000Z",
    splitType: "equal",
    shares: equalShares(12, PORTO),
    createdAt: "2026-05-03T19:05:00.000Z",
  },
  {
    id: "exp-porto-10",
    groupId: "grp-porto",
    description: "Almuerzo rúa Santa Catarina",
    amount: 64.8,
    categoryId: "cat-food",
    paidBy: "usr-luis",
    date: "2026-05-04T13:30:00.000Z",
    splitType: "equal",
    shares: equalShares(64.8, PORTO),
    createdAt: "2026-05-04T13:45:00.000Z",
  },
  {
    id: "exp-porto-11",
    groupId: "grp-porto",
    description: "Peajes de autopista",
    amount: 16,
    categoryId: "cat-transport",
    paidBy: "usr-pedro",
    date: "2026-05-04T17:50:00.000Z",
    splitType: "equal",
    shares: equalShares(16, PORTO),
    createdAt: "2026-05-04T17:55:00.000Z",
  },
];

const birthdayExpenses: Expense[] = [
  {
    id: "exp-bday-01",
    groupId: "grp-birthday",
    description: "Tarta encargada",
    amount: 28,
    categoryId: "cat-food",
    paidBy: "usr-ana",
    date: "2026-07-03T12:00:00.000Z",
    splitType: "equal",
    shares: equalShares(28, BIRTHDAY),
    createdAt: "2026-07-03T12:10:00.000Z",
  },
  {
    id: "exp-bday-02",
    groupId: "grp-birthday",
    description: "Señal reserva restaurante",
    amount: 40,
    categoryId: "cat-food",
    paidBy: "usr-luis",
    date: "2026-07-10T19:00:00.000Z",
    splitType: "equal",
    shares: equalShares(40, BIRTHDAY),
    createdAt: "2026-07-10T19:05:00.000Z",
  },
  {
    id: "exp-bday-03",
    groupId: "grp-birthday",
    description: "Cena en El Rincón",
    amount: 213,
    categoryId: "cat-food",
    paidBy: "usr-pedro",
    date: "2026-07-11T22:30:00.000Z",
    splitType: "custom",
    shares: sharesOf({ "usr-ana": 71, "usr-luis": 71, "usr-pedro": 71, "usr-carmen": 0 }),
    createdAt: "2026-07-11T22:45:00.000Z",
  },
  {
    id: "exp-bday-04",
    groupId: "grp-birthday",
    description: "Copas en la terraza",
    amount: 46,
    categoryId: "cat-leisure",
    paidBy: "usr-carmen",
    date: "2026-07-11T23:50:00.000Z",
    splitType: "equal",
    shares: equalShares(46, BIRTHDAY),
    createdAt: "2026-07-11T23:55:00.000Z",
  },
  {
    id: "exp-bday-05",
    groupId: "grp-birthday",
    description: "Ubers ida y vuelta",
    amount: 24,
    categoryId: "cat-transport",
    paidBy: "usr-ana",
    date: "2026-07-11T20:30:00.000Z",
    splitType: "custom",
    shares: sharesOf({ "usr-ana": 8, "usr-luis": 8, "usr-pedro": 8, "usr-carmen": 0 }),
    createdAt: "2026-07-11T23:58:00.000Z",
  },
  {
    id: "exp-bday-06",
    groupId: "grp-birthday",
    description: "Decoración y globos",
    amount: 19.6,
    categoryId: "cat-leisure",
    paidBy: "usr-luis",
    date: "2026-07-10T13:00:00.000Z",
    splitType: "equal",
    shares: equalShares(19.6, BIRTHDAY),
    createdAt: "2026-07-10T13:15:00.000Z",
  },
  {
    id: "exp-bday-07",
    groupId: "grp-birthday",
    description: "Regalo conjunto",
    amount: 90,
    categoryId: "cat-leisure",
    paidBy: "usr-pedro",
    date: "2026-07-12T11:00:00.000Z",
    splitType: "custom",
    shares: sharesOf({ "usr-ana": 30, "usr-luis": 30, "usr-pedro": 30, "usr-carmen": 0 }),
    createdAt: "2026-07-12T11:10:00.000Z",
  },
  {
    id: "exp-bday-08",
    groupId: "grp-birthday",
    description: "Chupitos en el bar",
    amount: 18,
    categoryId: "cat-leisure",
    paidBy: "usr-carmen",
    date: "2026-07-12T01:20:00.000Z",
    splitType: "equal",
    shares: equalShares(18, BIRTHDAY),
    createdAt: "2026-07-12T01:25:00.000Z",
  },
  {
    id: "exp-bday-09",
    groupId: "grp-birthday",
    description: "Impresión de la foto de grupo",
    amount: 6,
    categoryId: "cat-leisure",
    paidBy: "usr-ana",
    date: "2026-07-15T17:00:00.000Z",
    splitType: "equal",
    shares: equalShares(6, BIRTHDAY),
    createdAt: "2026-07-15T17:05:00.000Z",
  },
];

const flatExpenses: Expense[] = [
  {
    id: "exp-flat-01",
    groupId: "grp-flat",
    description: "Alquiler mayo",
    amount: 960,
    categoryId: "cat-home",
    paidBy: "usr-luis",
    date: "2026-05-01T09:00:00.000Z",
    splitType: "equal",
    shares: equalShares(960, FLAT),
    createdAt: "2026-05-01T09:05:00.000Z",
  },
  {
    id: "exp-flat-02",
    groupId: "grp-flat",
    description: "Alquiler junio",
    amount: 960,
    categoryId: "cat-home",
    paidBy: "usr-luis",
    date: "2026-06-01T09:00:00.000Z",
    splitType: "equal",
    shares: equalShares(960, FLAT),
    createdAt: "2026-06-01T09:05:00.000Z",
  },
  {
    id: "exp-flat-03",
    groupId: "grp-flat",
    description: "Alquiler julio",
    amount: 960,
    categoryId: "cat-home",
    paidBy: "usr-luis",
    date: "2026-07-01T09:00:00.000Z",
    splitType: "equal",
    shares: equalShares(960, FLAT),
    createdAt: "2026-07-01T09:05:00.000Z",
  },
  {
    id: "exp-flat-04",
    groupId: "grp-flat",
    description: "Luz y agua",
    amount: 84,
    categoryId: "cat-home",
    paidBy: "usr-ana",
    date: "2026-05-18T12:30:00.000Z",
    splitType: "equal",
    shares: equalShares(84, FLAT),
    createdAt: "2026-05-18T12:35:00.000Z",
  },
  {
    id: "exp-flat-05",
    groupId: "grp-flat",
    description: "Internet fibra",
    amount: 35.4,
    categoryId: "cat-home",
    paidBy: "usr-carmen",
    date: "2026-06-03T10:00:00.000Z",
    splitType: "equal",
    shares: equalShares(35.4, FLAT),
    createdAt: "2026-06-03T10:05:00.000Z",
  },
  {
    id: "exp-flat-06",
    groupId: "grp-flat",
    description: "Compra semanal supermercado",
    amount: 63,
    categoryId: "cat-food",
    paidBy: "usr-ana",
    date: "2026-06-12T18:45:00.000Z",
    splitType: "equal",
    shares: equalShares(63, FLAT),
    createdAt: "2026-06-12T18:50:00.000Z",
  },
  {
    id: "exp-flat-07",
    groupId: "grp-flat",
    description: "Compra semanal supermercado",
    amount: 57.6,
    categoryId: "cat-food",
    paidBy: "usr-carmen",
    date: "2026-06-26T19:42:00.000Z",
    splitType: "equal",
    shares: equalShares(57.6, FLAT),
    createdAt: "2026-06-26T19:45:00.000Z",
  },
  {
    id: "exp-flat-08",
    groupId: "grp-flat",
    description: "Gas de cocina",
    amount: 13.5,
    categoryId: "cat-home",
    paidBy: "usr-luis",
    date: "2026-07-08T11:20:00.000Z",
    splitType: "equal",
    shares: equalShares(13.5, FLAT),
    createdAt: "2026-07-08T11:25:00.000Z",
  },
  {
    id: "exp-flat-09",
    groupId: "grp-flat",
    description: "Productos de limpieza",
    amount: 16.5,
    categoryId: "cat-home",
    paidBy: "usr-carmen",
    date: "2026-07-14T10:10:00.000Z",
    splitType: "equal",
    shares: equalShares(16.5, FLAT),
    createdAt: "2026-07-14T10:15:00.000Z",
  },
  {
    id: "exp-flat-10",
    groupId: "grp-flat",
    description: "Bici nueva de Ana",
    amount: 129,
    categoryId: "cat-transport",
    paidBy: "usr-ana",
    date: "2026-05-10T16:00:00.000Z",
    splitType: "custom",
    shares: sharesOf({ "usr-ana": 129, "usr-luis": 0, "usr-carmen": 0 }),
    createdAt: "2026-05-10T16:10:00.000Z",
  },
];

export const expenses: Expense[] = [...portoExpenses, ...birthdayExpenses, ...flatExpenses];

/* ------------------------------------------------------------------ */
/* Tickets escaneados                                                  */
/* ------------------------------------------------------------------ */

export const ticketScans: TicketScan[] = [
  {
    id: "ticket-mercadona-01",
    merchant: "Mercadona",
    address: "Calle del Carmen 24, Madrid",
    date: "2026-06-26T19:42:00.000Z",
    currency: "EUR",
    items: [
      { name: "Leche entera 1L", price: 1.2, quantity: 2, categoryId: "cat-food" },
      { name: "Pan de molde integral", price: 1.85, quantity: 1, categoryId: "cat-food" },
      { name: "Huevos (docena)", price: 2.4, quantity: 1, categoryId: "cat-food" },
      { name: "Pollo entero 1kg", price: 6.75, quantity: 1, categoryId: "cat-food" },
      { name: "Tomates pera 1kg", price: 2.3, quantity: 1, categoryId: "cat-food" },
      { name: "Queso manchego", price: 4.1, quantity: 1, categoryId: "cat-food" },
      { name: "Café molido", price: 3.95, quantity: 1, categoryId: "cat-food" },
      { name: "Aceite de oliva 1L", price: 9.95, quantity: 1, categoryId: "cat-food" },
      { name: "Agua mineral (6×1,5L)", price: 2.6, quantity: 1, categoryId: "cat-food" },
      { name: "Yogures naturales (8 uds)", price: 3.15, quantity: 1, categoryId: "cat-food" },
    ],
    subtotal: 39.45,
    tax: 3.95,
    total: 43.4,
  },
  {
    id: "ticket-rincon-01",
    merchant: "El Rincón de Carmen",
    address: "Calle Mayor 12, Madrid",
    date: "2026-07-11T23:18:00.000Z",
    currency: "EUR",
    items: [
      { name: "Croquetas caseras", price: 9.5, quantity: 1, categoryId: "cat-food" },
      { name: "Ensalada de la casa", price: 8.9, quantity: 1, categoryId: "cat-food" },
      { name: "Solomillo de cerdo", price: 22.5, quantity: 1, categoryId: "cat-food" },
      { name: "Lubina a la sal", price: 24, quantity: 1, categoryId: "cat-food" },
      { name: "Tarta de queso", price: 6.5, quantity: 1, categoryId: "cat-food" },
      { name: "Café", price: 2.2, quantity: 2, categoryId: "cat-food" },
      { name: "Vino Rioja (botella)", price: 18, quantity: 1, categoryId: "cat-food" },
    ],
    subtotal: 93.8,
    tax: 9.38,
    total: 103.18,
  },
];

/* ------------------------------------------------------------------ */
/* Balances                                                            */
/* ------------------------------------------------------------------ */

function computeBalances(group: Group): Balance[] {
  const totals = new Map<string, number>();
  for (const member of group.members) totals.set(member.userId, 0);

  for (const expense of expenses) {
    if (expense.groupId !== group.id) continue;
    totals.set(expense.paidBy, (totals.get(expense.paidBy) ?? 0) + expense.amount);
    for (const share of expense.shares) {
      totals.set(share.userId, (totals.get(share.userId) ?? 0) - share.amount);
    }
  }

  return group.members.map((member) => ({
    userId: member.userId,
    amount: Math.round(((totals.get(member.userId) ?? 0) + Number.EPSILON) * 100) / 100,
  }));
}

/* ------------------------------------------------------------------ */
/* "API" simulada                                                      */
/* ------------------------------------------------------------------ */

export async function getGroups(): Promise<Group[]> {
  await delay(300 + Math.random() * 300);
  return groups;
}

export async function getGroupById(id: string): Promise<Group | undefined> {
  await delay(300 + Math.random() * 300);
  return groups.find((group) => group.id === id);
}

export async function getExpensesByGroupId(id: string): Promise<Expense[]> {
  await delay(300 + Math.random() * 300);
  return expenses.filter((expense) => expense.groupId === id);
}

export async function getExpenseById(id: string): Promise<Expense | undefined> {
  await delay(300 + Math.random() * 300);
  return expenses.find((expense) => expense.id === id);
}

export async function getBalanceByGroupId(id: string): Promise<Balance[]> {
  await delay(300 + Math.random() * 300);
  const group = groups.find((group) => group.id === id);
  if (!group) return [];
  return computeBalances(group);
}

export async function getTicketScanMock(): Promise<TicketScan> {
  await delay(300 + Math.random() * 300);
  return ticketScans[0];
}
