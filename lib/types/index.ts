import type { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name: string;
  email: string;
  /** Clase de Tailwind para el fondo del avatar */
  avatarColor: string;
}

export interface GroupMember {
  userId: string;
  groupId: string;
  role: "admin" | "member";
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  currency: string;
  members: GroupMember[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  /** Componente de icono de lucide-react */
  icon: LucideIcon;
  /** Clase de Tailwind para el color del icono */
  color: string;
}

export interface ExpenseShare {
  userId: string;
  amount: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  /** Usuarios que se reparten este item (split "items") */
  assignedTo?: string[];
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  categoryId: string;
  paidBy: string;
  /** Fecha del gasto (ISO) */
  date: string;
  splitType: "equal" | "custom" | "items";
  shares: ExpenseShare[];
  items?: ExpenseItem[];
  createdAt: string;
}

export interface Balance {
  userId: string;
  /** Positivo = le deben, negativo = debe */
  amount: number;
}

export interface TicketScan {
  id: string;
  merchant: string;
  address?: string;
  date: string;
  currency: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    categoryId: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}
