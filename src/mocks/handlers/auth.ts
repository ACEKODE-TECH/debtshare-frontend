import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";
import type { AuthResponse, GoogleAuthPayload, LoginPayload, RegisterPayload } from "@/types";

import { getDb } from "../db";
import { createUser } from "../factories";
import { errorResponse, randomDelayMs } from "../utils";

function fakeToken(userId: string): string {
  return `mock_jwt_${userId}_${Date.now()}`;
}

export const authHandlers = [
  // POST /auth/login
  http.post(`/api${ENDPOINTS.AUTH_LOGIN}`, async ({ request }) => {
    await randomDelayMs(400, 800);

    const body = (await request.json()) as LoginPayload;

    if (!body.email || !body.password) {
      return errorResponse(400, "Email y contraseña son obligatorios.");
    }

    const user = getDb().users.find((u) => u.email.toLowerCase() === body.email.toLowerCase());

    if (!user) {
      return errorResponse(401, "Email o contraseña incorrectos.");
    }

    // Any password works against the mock — we just check the user exists
    const response: AuthResponse = { token: fakeToken(user.id), user };
    return HttpResponse.json(response);
  }),

  // POST /auth/register
  http.post(`/api${ENDPOINTS.AUTH_REGISTER}`, async ({ request }) => {
    await randomDelayMs(500, 900);

    const body = (await request.json()) as RegisterPayload;
    const db = getDb();

    const emailTaken = db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (emailTaken) {
      return errorResponse(409, "Ya existe una cuenta con ese email.");
    }

    const aliasTaken = db.users.some((u) => u.alias.toLowerCase() === body.alias.toLowerCase());
    if (aliasTaken) {
      return errorResponse(409, "Ese alias ya está en uso. Prueba con otro.");
    }

    const newUser = createUser({
      name: body.name,
      alias: body.alias,
      email: body.email,
    });
    db.users.push(newUser);

    const response: AuthResponse = { token: fakeToken(newUser.id), user: newUser };
    return HttpResponse.json(response, { status: 201 });
  }),

  // POST /auth/google
  http.post(`/api${ENDPOINTS.AUTH_GOOGLE}`, async ({ request }) => {
    await randomDelayMs(600, 1000);

    const body = (await request.json()) as GoogleAuthPayload;
    if (!body.credential) {
      return errorResponse(400, "Token de Google no proporcionado.");
    }

    // Simulate Google OAuth by logging in as the first user (Marta)
    const user = getDb().users[0];
    const response: AuthResponse = { token: fakeToken(user.id), user };
    return HttpResponse.json(response);
  }),

  // POST /auth/logout
  http.post(`/api${ENDPOINTS.AUTH_LOGOUT}`, async () => {
    await randomDelayMs(200, 400);
    return HttpResponse.json({ message: "Sesión cerrada." });
  }),
];
