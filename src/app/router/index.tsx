import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout/RootLayout";
import { AvatarShowcase } from "@/features/design-system/pages/AvatarShowcase";
import { BadgeShowcase } from "@/features/design-system/pages/BadgeShowcase";
import { BellShowcase } from "@/features/design-system/pages/BellShowcase";
import { ButtonShowcase } from "@/features/design-system/pages/ButtonShowcase";
import { DesignSystemIndex } from "@/features/design-system/pages/DesignSystemIndex";
import { ExpenseCardShowcase } from "@/features/design-system/pages/ExpenseCardShowcase";
import { InputShowcase } from "@/features/design-system/pages/InputShowcase";
import { TabsShowcase } from "@/features/design-system/pages/TabsShowcase";

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
      { path: "design-system/badge", element: <BadgeShowcase /> },
      { path: "design-system/bell", element: <BellShowcase /> },
      { path: "design-system/button", element: <ButtonShowcase /> },
      { path: "design-system/expense-card", element: <ExpenseCardShowcase /> },
      { path: "design-system/input", element: <InputShowcase /> },
      { path: "design-system/tabs", element: <TabsShowcase /> },
    ],
  },
]);
