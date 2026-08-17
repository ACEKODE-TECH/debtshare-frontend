import tokens from "./packages/design-tokens/build/web/tailwind.tokens.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Dark theme is triggered by [data-theme="dark"] on an ancestor. See
  // packages/design-tokens/build/web/tokens.css for the semantic overrides.
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    // Replace, not extend: the theme comes wholesale from the design-tokens
    // package so tailwind.config.js has nothing to say about visual values.
    // Every colour/size/radius/shadow lives in packages/design-tokens/src/.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      ...tokens.colors,
      "brand-overlay": {
        faint: "var(--color-brand-overlay-faint)",
        subtle: "var(--color-brand-overlay-subtle)",
        light: "var(--color-brand-overlay-light)",
        medium: "var(--color-brand-overlay-medium)",
        strong: "var(--color-brand-overlay-strong)",
        bold: "var(--color-brand-overlay-bold)",
        bolder: "var(--color-brand-overlay-bolder)",
        text: "var(--color-brand-overlay-text)",
        "text-strong": "var(--color-brand-overlay-text-strong)",
        "text-emphasis": "var(--color-brand-overlay-text-emphasis)",
      },
    },
    fontFamily: tokens.fontFamily,
    fontSize: tokens.fontSize,
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    boxShadow: tokens.boxShadow,
    extend: {
      keyframes: {
        "bell-pop": {
          "0%": { transform: "scale(0.6)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "bell-pop": "bell-pop 200ms ease-out",
      },
    },
  },
  plugins: [],
};
