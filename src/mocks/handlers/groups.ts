import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";
import type { Group, GroupMember } from "@/types";

import { getDb } from "../db";
import { createGroup, createGroupMember } from "../factories";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const groupHandlers = [
  // GET /groups — groups where the current user is a member
  http.get(`/api${ENDPOINTS.GROUPS}`, async () => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const myId = db.users[0].id;
    const myGroupIds = new Set(db.groupMembers.filter((m) => m.userId === myId).map((m) => m.groupId));
    return HttpResponse.json(db.groups.filter((g) => myGroupIds.has(g.id)));
  }),

  // GET /groups/:id
  http.get("/api/groups/:id", async ({ params }) => {
    await randomDelayMs();
    const group = getDb().groups.find((g) => g.id === params.id);
    if (!group) return errorResponse(404, "Grupo no encontrado");
    return HttpResponse.json(group);
  }),

  // POST /groups
  http.post(`/api${ENDPOINTS.GROUPS}`, async ({ request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const body = (await request.json()) as Partial<Group>;
    const me = db.users[0];

    const group = createGroup({
      ...body,
      createdBy: me.id,
      createdAt: new Date().toISOString(),
    });
    db.groups.push(group);

    db.groupMembers.push(
      createGroupMember({
        groupId: group.id,
        userId: me.id,
        joinedAt: group.createdAt,
      }),
    );

    return HttpResponse.json(group, { status: 201 });
  }),

  // PUT /groups/:id
  http.put("/api/groups/:id", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.groups.findIndex((g) => g.id === params.id);
    if (index === -1) return errorResponse(404, "Grupo no encontrado");

    const body = (await request.json()) as Partial<Group>;
    db.groups[index] = { ...db.groups[index], ...body, id: db.groups[index].id };
    return HttpResponse.json(db.groups[index]);
  }),

  // DELETE /groups/:id
  http.delete("/api/groups/:id", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.groups.findIndex((g) => g.id === params.id);
    if (index === -1) return errorResponse(404, "Grupo no encontrado");

    const groupId = db.groups[index].id;
    db.groups.splice(index, 1);
    db.groupMembers = db.groupMembers.filter((m) => m.groupId !== groupId);
    db.expenses = db.expenses.filter((e) => e.groupId !== groupId);
    db.expenseSplits = db.expenseSplits.filter((s) => !db.expenses.every((e) => e.id !== s.expenseId));
    db.settlements = db.settlements.filter((s) => s.groupId !== groupId);
    db.invitations = db.invitations.filter((i) => i.groupId !== groupId);

    return new HttpResponse(null, { status: 204 });
  }),

  // GET /groups/:id/members
  http.get("/api/groups/:groupId/members", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const members = db.groupMembers
      .filter((m) => m.groupId === params.groupId)
      .map((member) => ({
        ...member,
        user: db.users.find((u) => u.id === member.userId) ?? null,
      }));

    return HttpResponse.json(members);
  }),

  // POST /groups/:id/members — add a user directly (not via invitation)
  http.post("/api/groups/:groupId/members", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const body = (await request.json()) as { userId: string };
    const groupId = String(params.groupId);

    if (!db.groups.find((g) => g.id === groupId)) return errorResponse(404, "Grupo no encontrado");

    const existing = db.groupMembers.find((m) => m.groupId === groupId && m.userId === body.userId);
    if (existing) return errorResponse(409, "El usuario ya es miembro del grupo");

    const member: GroupMember = createGroupMember({
      groupId,
      userId: body.userId,
      joinedAt: new Date().toISOString(),
    });
    db.groupMembers.push(member);

    return HttpResponse.json(
      { ...member, user: db.users.find((u) => u.id === body.userId) ?? null },
      { status: 201 },
    );
  }),

  // DELETE /groups/:groupId/members/:memberId
  http.delete("/api/groups/:groupId/members/:memberId", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const index = db.groupMembers.findIndex((m) => m.groupId === params.groupId && m.id === params.memberId);
    if (index === -1) return errorResponse(404, "Miembro no encontrado");

    db.groupMembers.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
