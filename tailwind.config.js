/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Placeholder token slots — se rellenan con el design system real en la Seccion 2.
      // Todos leen de custom properties (src/index.css) para poder theming sin tocar este archivo.
      colors: {
        brand: "var(--color-brand)",
        surface: "var(--color-surface)",
        ink: "var(--color-ink)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};
