import { balanceHandlers } from "./balances";
import { expenseHandlers } from "./expenses";
import { groupHandlers } from "./groups";
import { receiptHandlers } from "./receipts";
import { userHandlers } from "./users";

export const handlers = [
  ...userHandlers,
  ...groupHandlers,
  ...expenseHandlers,
  ...receiptHandlers,
  ...balanceHandlers,
];
