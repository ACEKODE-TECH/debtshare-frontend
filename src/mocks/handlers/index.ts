import { authHandlers } from "./auth";
import { balanceHandlers } from "./balances";
import { categoryHandlers } from "./categories";
import { exchangeRateHandlers } from "./exchange-rates";
import { expenseHandlers } from "./expenses";
import { groupHandlers } from "./groups";
import { invitationHandlers } from "./invitations";
import { notificationHandlers } from "./notifications";
import { receiptHandlers } from "./receipts";
import { settlementHandlers } from "./settlements";
import { userHandlers } from "./users";

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...groupHandlers,
  ...categoryHandlers,
  ...expenseHandlers,
  ...receiptHandlers,
  ...settlementHandlers,
  ...balanceHandlers,
  ...exchangeRateHandlers,
  ...invitationHandlers,
  ...notificationHandlers,
];
