import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout/RootLayout";
import { ButtonShowcase } from "@/features/design-system/pages/ButtonShowcase";
import { InputShowcase } from "@/features/design-system/pages/InputShowcase";

// Placeholder index route so the shell has something to render before any
// feature exists. Replaced by the real dashboard/groups routes as each
// feature lands.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <p>Debtshare — esqueleto del proyecto listo, sin UI todavia.</p> },
      { path: "design-system/button", element: <ButtonShowcase /> },
      { path: "design-system/input", element: <InputShowcase /> },
    ],
  },
]);
