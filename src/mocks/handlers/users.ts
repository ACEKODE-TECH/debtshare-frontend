import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";

import { getCurrentUser, getDb } from "../db";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const userHandlers = [
  // GET /me
  http.get(`/api${ENDPOINTS.ME}`, async () => {
    await randomDelayMs();
    return HttpResponse.json(getCurrentUser());
  }),

  // GET /users
  http.get(`/api${ENDPOINTS.USERS}`, async ({ request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();

    let results = getDb().users;
    if (search) {
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.alias.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }

    return HttpResponse.json(results);
  }),

  // GET /users/:id
  http.get("/api/users/:id", async ({ params }) => {
    await randomDelayMs();
    const user = getDb().users.find((u) => u.id === params.id);
    if (!user) return errorResponse(404, "Usuario no encontrado");
    return HttpResponse.json(user);
  }),

  // GET /users/check-alias/:alias
  http.get("/api/users/check-alias/:alias", async ({ params }) => {
    await randomDelayMs(200, 500);
    const alias = (params.alias as string).toLowerCase();
    const taken = getDb().users.some((u) => u.alias.toLowerCase() === alias);
    return HttpResponse.json({ available: !taken });
  }),

  // GET /users/alias/:alias
  http.get("/api/users/alias/:alias", async ({ params }) => {
    await randomDelayMs();
    const user = getDb().users.find((u) => u.alias === params.alias);
    if (!user) return errorResponse(404, "Usuario no encontrado");
    return HttpResponse.json(user);
  }),

  // PUT /users/:id
  http.put("/api/users/:id", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.users.findIndex((u) => u.id === params.id);
    if (index === -1) return errorResponse(404, "Usuario no encontrado");

    const body = (await request.json()) as Record<string, unknown>;
    db.users[index] = { ...db.users[index], ...body, id: db.users[index].id };
    return HttpResponse.json(db.users[index]);
  }),
];
