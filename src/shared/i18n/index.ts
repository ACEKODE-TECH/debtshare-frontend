import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEs from "./locales/es/common.json";
import authEs from "./locales/es/auth.json";
import groupsEs from "./locales/es/groups.json";

export const defaultNS = "common";
export const supportedLanguages = ["es"] as const;

const IS_DEV = import.meta.env?.DEV;

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
  // Fail loud in dev on missing keys so literals like `switcher.backToList`
  // never reach the UI. In prod we let i18next fall back silently.
  saveMissing: IS_DEV,
  missingKeyHandler: IS_DEV
    ? (lngs, ns, key) => {
        console.error(`[i18n] Missing translation: ${ns}:${key} (${lngs.join(",")})`);
      }
    : undefined,
});

export default i18n;
