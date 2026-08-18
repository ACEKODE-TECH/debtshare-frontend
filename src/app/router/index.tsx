import { createBrowserRouter, Navigate } from "react-router";

import { AppLayout } from "@/app/layout/AppLayout";
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
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: (
                  <div className="p-xl lg:p-2xl">
                    <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">
                      Dashboard
                    </h1>
                    <p className="mt-sm text-lg text-text-tertiary">Pendiente de implementar.</p>
                  </div>
                ),
              },
              {
                path: "groups",
                element: (
                  <div className="p-xl lg:p-2xl">
                    <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">
                      Grupos
                    </h1>
                    <p className="mt-sm text-lg text-text-tertiary">Pendiente de implementar.</p>
                  </div>
                ),
              },
              {
                path: "activity",
                element: (
                  <div className="p-xl lg:p-2xl">
                    <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">
                      Actividad
                    </h1>
                    <p className="mt-sm text-lg text-text-tertiary">Pendiente de implementar.</p>
                  </div>
                ),
              },
              {
                path: "history",
                element: (
                  <div className="p-xl lg:p-2xl">
                    <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">
                      Historial
                    </h1>
                    <p className="mt-sm text-lg text-text-tertiary">Pendiente de implementar.</p>
                  </div>
                ),
              },
              {
                path: "profile",
                element: (
                  <div className="p-xl lg:p-2xl">
                    <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">
                      Perfil
                    </h1>
                    <p className="mt-sm text-lg text-text-tertiary">Pendiente de implementar.</p>
                  </div>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
