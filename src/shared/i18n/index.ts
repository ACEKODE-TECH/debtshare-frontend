import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEs from "./locales/es/common.json";
import authEs from "./locales/es/auth.json";
import groupsEs from "./locales/es/groups.json";

export const defaultNS = "common";
export const supportedLanguages = ["es"] as const;

i18n.use(initReactI18next).init({
  lng: "es",
  fallbackLng: "es",
  defaultNS,
  ns: ["common", "auth", "groups"],
  resources: {
    es: {
      common: commonEs,
      auth: authEs,
      groups: groupsEs,
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
