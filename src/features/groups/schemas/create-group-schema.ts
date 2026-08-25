import { z } from "zod";

import i18n from "@/shared/i18n";
import type { CurrencyCode } from "@/types";

import { GROUP_ICON_ORDER, type GroupIconKey } from "../lib/group-icons";

export const CURRENCY_OPTIONS: CurrencyCode[] = ["EUR", "USD", "GBP"];

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, i18n.t("groups:create.validation.nameTooShort"))
    .max(50, i18n.t("groups:create.validation.nameTooLong")),
  description: z.string().trim().max(140, i18n.t("groups:create.validation.descriptionTooLong")),
  currency: z.enum(CURRENCY_OPTIONS as [CurrencyCode, ...CurrencyCode[]]),
  icon: z.enum(GROUP_ICON_ORDER as [GroupIconKey, ...GroupIconKey[]]),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
