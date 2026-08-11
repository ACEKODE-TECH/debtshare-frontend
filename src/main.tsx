import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-host Plus Jakarta Sans in the weights the design tokens reference
// (body/display use 400-800). Vite emits each woff2 as a hashed asset and the
// @font-face declarations arrive with the bundle CSS.
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

import { App } from "@/app/App";

import "./index.css";

async function enableMocking() {
  if (!import.meta.env.DEV) return;

  const { worker } = await import("@/mocks/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
