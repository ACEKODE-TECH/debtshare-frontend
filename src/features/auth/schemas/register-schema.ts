import i18n from "i18next";
import { z } from "zod";

const ALIAS_PATTERN = /^[a-zA-Z0-9._]+$/;

export function createRegisterSchema() {
  return z.object({
    alias: z
      .string()
      .min(1, i18n.t("validation.aliasRequired"))
      .min(3, i18n.t("validation.aliasTooShort"))
      .max(20, i18n.t("validation.aliasTooLong"))
      .regex(ALIAS_PATTERN, i18n.t("validation.aliasInvalidChars")),
    email: z.string().min(1, i18n.t("validation.emailRequired")).email(i18n.t("validation.emailInvalid")),
    password: z
      .string()
      .min(1, i18n.t("validation.passwordRequired"))
      .min(8, i18n.t("validation.passwordTooShort")),
    acceptTerms: z.literal(true, { message: i18n.t("validation.termsRequired") }),
  });
}

export const registerSchema = createRegisterSchema();

export type RegisterFormData = z.infer<typeof registerSchema>;
