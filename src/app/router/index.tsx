import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout/RootLayout";
import { AvatarShowcase } from "@/features/design-system/pages/AvatarShowcase";
import { ButtonShowcase } from "@/features/design-system/pages/ButtonShowcase";
import { DesignSystemIndex } from "@/features/design-system/pages/DesignSystemIndex";

// Placeholder index route so the shell has something to render before any
// feature exists. Replaced by the real dashboard/groups routes as each
// feature lands.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <p>Debtshare — esqueleto del proyecto listo, sin UI todavia.</p> },
      { path: "design-system", element: <DesignSystemIndex /> },
      { path: "design-system/avatar", element: <AvatarShowcase /> },
      { path: "design-system/button", element: <ButtonShowcase /> },
    ],
  },
]);
