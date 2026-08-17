import i18n from "i18next";
import { z } from "zod";

export function createLoginSchema() {
  return z.object({
    email: z.string().min(1, i18n.t("validation.emailRequired")).email(i18n.t("validation.emailInvalid")),
    password: z.string().min(1, i18n.t("validation.passwordRequired")),
  });
}

export const loginSchema = createLoginSchema();

export type LoginFormData = z.infer<typeof loginSchema>;
