import { http, HttpResponse } from "msw";

import { ENDPOINTS } from "@/lib/endpoints";
import type { Group, GroupMember, GroupSummary } from "@/types";

import { getDb } from "../db";
import { createGroup, createGroupMember } from "../factories";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const groupHandlers = [
  // GET /groups — groups where the current user is a member (with counts)
  http.get(`/api${ENDPOINTS.GROUPS}`, async () => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const myId = db.users[0].id;
    const myGroupIds = new Set(db.groupMembers.filter((m) => m.userId === myId).map((m) => m.groupId));

    const summaries: GroupSummary[] = db.groups
      .filter((g) => myGroupIds.has(g.id))
      .map((g) => {
        const groupMembers = db.groupMembers.filter((m) => m.groupId === g.id);
        const memberIds = new Set(groupMembers.map((m) => m.userId));
        const groupExpenses = db.expenses.filter((e) => e.groupId === g.id);
        const mySplits = db.expenseSplits.filter(
          (s) => s.userId === myId && groupExpenses.some((e) => e.id === s.expenseId),
        );
        const myPaid = groupExpenses.filter((e) => e.paidBy === myId).reduce((a, e) => a + e.amount, 0);
        const myOwed = mySplits.reduce((a, s) => a + s.amount, 0);
        const settlements = db.settlements.filter((s) => s.groupId === g.id && s.status === "completed");
        const settlementDelta = settlements.reduce((acc, s) => {
          if (s.fromUserId === myId) return acc + s.amount;
          if (s.toUserId === myId) return acc - s.amount;
          return acc;
        }, 0);
        const balance = Math.round((myPaid - myOwed + settlementDelta) * 100) / 100;

        const lastExpense = groupExpenses.reduce<string | null>(
          (latest, e) => (!latest || e.date > latest ? e.date : latest),
          null,
        );
        const lastSettlement = db.settlements
          .filter((s) => s.groupId === g.id && s.status === "completed" && s.settledAt)
          .reduce<string | null>(
            (latest, s) => (!latest || (s.settledAt as string) > latest ? s.settledAt : latest),
            null,
          );
        const lastActivityAt =
          lastExpense && lastSettlement
            ? lastExpense > lastSettlement
              ? lastExpense
              : lastSettlement
            : (lastExpense ?? lastSettlement);

        // "settled" = no expenses OR everyone is at zero (all splits equal their paid share)
        const status: GroupSummary["status"] =
          balance === 0 && groupExpenses.length > 0 ? "settled" : "active";

        // Members preview: me first, then others (up to 4 total)
        const orderedMembers = [
          ...groupMembers.filter((m) => m.userId === myId),
          ...groupMembers.filter((m) => m.userId !== myId),
        ];
        const memberPreview = orderedMembers
          .slice(0, 4)
          .map((m) => db.users.find((u) => u.id === m.userId))
          .filter((u): u is NonNullable<typeof u> => u !== undefined)
          .map((u) => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl }));

        return {
          ...g,
          memberCount: memberIds.size,
          expenseCount: groupExpenses.length,
          totalExpenses: Math.round(groupExpenses.reduce((a, e) => a + e.amount, 0) * 100) / 100,
          myBalance: balance,
          status,
          lastActivityAt,
          memberPreview,
        };
      });

    return HttpResponse.json(summaries);
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
