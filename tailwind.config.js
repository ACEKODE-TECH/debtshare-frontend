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
    colors: tokens.colors,
    fontFamily: tokens.fontFamily,
    fontSize: tokens.fontSize,
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    boxShadow: tokens.boxShadow,
    extend: {},
  },
  plugins: [],
};
