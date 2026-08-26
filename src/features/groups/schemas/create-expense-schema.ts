import { z } from "zod";

import i18n from "@/shared/i18n";
import type { CurrencyCode } from "@/types";

const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "GBP"];

export const createExpenseSchema = z.object({
  description: z
    .string()
    .trim()
    .min(2, i18n.t("groups:expense.validation.descriptionTooShort"))
    .max(80, i18n.t("groups:expense.validation.descriptionTooLong")),
  amount: z
    .number({ error: i18n.t("groups:expense.validation.amountRequired") })
    .positive(i18n.t("groups:expense.validation.amountPositive"))
    .max(1_000_000, i18n.t("groups:expense.validation.amountTooBig")),
  currency: z.enum(CURRENCIES as [CurrencyCode, ...CurrencyCode[]]),
  categoryId: z.string().min(1, i18n.t("groups:expense.validation.categoryRequired")),
  date: z.string().min(1, i18n.t("groups:expense.validation.dateRequired")),
  paidBy: z.string().min(1, i18n.t("groups:expense.validation.payerRequired")),
  /** Members INCLUDED in the split. Server payload derives excludeMembers from this. */
  includedMembers: z.array(z.string()).min(1, i18n.t("groups:expense.validation.membersRequired")),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;
