import { createBrowserRouter, Navigate } from "react-router";

import { AppLayout } from "@/app/layout/AppLayout";
import { RootLayout } from "@/app/layout/RootLayout";

import { RequireAuth, RequireGuest } from "./AuthGuard";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-xl lg:p-2xl">
      <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">{title}</h1>
      <p className="mt-sm text-lg text-text-tertiary">Pendiente de implementar.</p>
    </div>
  );
}

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
        path: "invite/:token",
        lazy: () =>
          import("@/features/groups/pages/InvitePage").then((m) => ({
            Component: m.InvitePage,
          })),
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
                element: <Navigate to="/app/groups" replace />,
              },
              {
                path: "groups",
                element: <Placeholder title="Grupos" />,
              },
              {
                path: "groups/:groupId",
                element: <Placeholder title="Grupo" />,
              },
              {
                path: "groups/:groupId/dashboard",
                element: <Placeholder title="Dashboard de grupo" />,
              },
              {
                path: "groups/:groupId/expenses/:expenseId",
                element: <Placeholder title="Detalle de gasto" />,
              },
              {
                path: "activity",
                element: <Placeholder title="Actividad" />,
              },
              {
                path: "profile",
                element: <Placeholder title="Perfil" />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
