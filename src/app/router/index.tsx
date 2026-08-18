import { createBrowserRouter, Navigate } from "react-router";

import { RootLayout } from "@/app/layout/RootLayout";

import { RequireAuth, RequireGuest } from "./AuthGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      {
        element: <RequireGuest />,
        children: [
          {
            path: "login",
            lazy: () =>
              import("@/features/auth/pages/LoginPage").then((m) => ({
                Component: m.LoginPage,
              })),
          },
          {
            path: "register",
            lazy: () =>
              import("@/features/auth/pages/RegisterPage").then((m) => ({
                Component: m.RegisterPage,
              })),
          },
        ],
      },

      {
        path: "app",
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <p className="p-xl text-text-secondary">Dashboard — pendiente de implementar.</p>,
          },
        ],
      },
    ],
  },
]);
