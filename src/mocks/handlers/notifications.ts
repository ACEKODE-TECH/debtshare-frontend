import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";

import { getDb } from "../db";
import { cursorPaginate, errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const notificationHandlers = [
  // GET /notifications — for the current user, cursor-paginated, newest first
  http.get(`/api${ENDPOINTS.NOTIFICATIONS}`, async ({ request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const type = url.searchParams.get("type");

    const db = getDb();
    const me = db.users[0];
    let items = db.notifications
      .filter((n) => n.userId === me.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    if (type) {
      items = items.filter((n) => n.type === type);
    }

    const unreadCount = db.notifications.filter((n) => n.userId === me.id && !n.isRead).length;

    return HttpResponse.json({
      ...cursorPaginate(items, cursor, limit),
      unreadCount,
    });
  }),

  // PATCH /notifications/:id — mark single notification as read
  http.patch("/api/notifications/:id", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const notification = db.notifications.find((n) => n.id === params.id);
    if (!notification) return errorResponse(404, "Notificacion no encontrada");

    const body = (await request.json()) as { isRead?: boolean };
    if (body.isRead !== undefined) notification.isRead = body.isRead;

    return HttpResponse.json(notification);
  }),

  // POST /notifications/read-all — mark all as read for current user
  http.post(`/api${ENDPOINTS.NOTIFICATIONS_READ_ALL}`, async () => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const me = db.users[0];
    let count = 0;

    for (const n of db.notifications) {
      if (n.userId === me.id && !n.isRead) {
        n.isRead = true;
        count += 1;
      }
    }

    return HttpResponse.json({ markedAsRead: count });
  }),
];
