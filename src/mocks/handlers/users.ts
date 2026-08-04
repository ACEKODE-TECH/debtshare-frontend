import { http, HttpResponse } from "msw";

import { currentUser, users } from "../fixtures";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const userHandlers = [
  http.get("/api/me", async () => {
    await randomDelayMs();
    return HttpResponse.json(currentUser);
  }),

  http.get("/api/users", async () => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    return HttpResponse.json(users);
  }),

  http.get("/api/users/:id", async ({ params }) => {
    await randomDelayMs();
    const user = users.find((u) => u.id === params.id);
    if (!user) return errorResponse(404, "Usuario no encontrado");
    return HttpResponse.json(user);
  }),
];
