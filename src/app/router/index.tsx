import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ index: true, element: <p>Debtshare — esqueleto del proyecto listo, sin UI todavia.</p> }],
  },
]);
