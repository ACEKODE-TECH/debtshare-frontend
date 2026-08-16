import { http, HttpResponse } from "msw";

import { getDb } from "../db";
import { createGroupInvitation, createGroupMember, createNotification } from "../factories";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const invitationHandlers = [
  // GET /groups/:groupId/invitations
  http.get("/api/groups/:groupId/invitations", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const invitations = db.invitations.filter((i) => i.groupId === params.groupId);
    return HttpResponse.json(invitations);
  }),

  // POST /groups/:groupId/invitations — create invitation (by alias or link)
  http.post("/api/groups/:groupId/invitations", async ({ params, request }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const groupId = String(params.groupId);
    const body = (await request.json()) as {
      method: "alias" | "link";
      alias?: string;
    };

    if (!db.groups.find((g) => g.id === groupId)) return errorResponse(404, "Grupo no encontrado");

    const me = db.users[0];
    let inviteeUserId: string | null = null;

    if (body.method === "alias") {
      if (!body.alias) return errorResponse(400, "El campo alias es requerido para invitaciones por alias");

      const invitee = db.users.find((u) => u.alias === body.alias);
      if (!invitee) return errorResponse(404, "Usuario no encontrado con ese alias");

      const alreadyMember = db.groupMembers.find((m) => m.groupId === groupId && m.userId === invitee.id);
      if (alreadyMember) return errorResponse(409, "El usuario ya es miembro del grupo");

      inviteeUserId = invitee.id;
    }

    const invitation = createGroupInvitation({
      groupId,
      invitedByUserId: me.id,
      method: body.method,
      inviteeUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    db.invitations.push(invitation);

    // For alias invitations, generate a notification for the invitee
    if (inviteeUserId) {
      db.notifications.push(
        createNotification({
          userId: inviteeUserId,
          groupId,
          type: "invitation_received",
          invitationId: invitation.id,
          isRead: false,
        }),
      );
    }

    return HttpResponse.json(invitation, { status: 201 });
  }),

  // POST /invitations/:id/accept — accept invitation, create GroupMember (rule §9.9)
  http.post("/api/invitations/:id/accept", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const invitation = db.invitations.find((i) => i.id === params.id);
    if (!invitation) return errorResponse(404, "Invitacion no encontrada");
    if (invitation.status !== "pending") return errorResponse(400, "Esta invitacion ya fue resuelta");

    const me = db.users[0];
    const userId = invitation.inviteeUserId ?? me.id;

    invitation.status = "accepted";

    // Create the GroupMember
    const member = createGroupMember({
      groupId: invitation.groupId,
      userId,
      joinedAt: new Date().toISOString(),
    });
    db.groupMembers.push(member);

    return HttpResponse.json({ invitation, member });
  }),

  // POST /invitations/:id/decline
  http.post("/api/invitations/:id/decline", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const invitation = db.invitations.find((i) => i.id === params.id);
    if (!invitation) return errorResponse(404, "Invitacion no encontrada");
    if (invitation.status !== "pending") return errorResponse(400, "Esta invitacion ya fue resuelta");

    invitation.status = "declined";

    return HttpResponse.json(invitation);
  }),

  // GET /invitations/token/:token — resolve link invitation
  http.get("/api/invitations/token/:token", async ({ params }) => {
    await randomDelayMs();

    const db = getDb();
    const invitation = db.invitations.find((i) => i.token === params.token && i.method === "link");
    if (!invitation) return errorResponse(404, "Enlace de invitacion no valido o expirado");

    const group = db.groups.find((g) => g.id === invitation.groupId);
    return HttpResponse.json({ invitation, group: group ?? null });
  }),

  // POST /invitations/token/:token — join via link (rule §9.7: no pending state)
  http.post("/api/invitations/token/:token", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const db = getDb();
    const invitation = db.invitations.find((i) => i.token === params.token && i.method === "link");
    if (!invitation) return errorResponse(404, "Enlace de invitacion no valido o expirado");

    const me = db.users[0];

    const alreadyMember = db.groupMembers.find((m) => m.groupId === invitation.groupId && m.userId === me.id);
    if (alreadyMember) return errorResponse(409, "Ya eres miembro de este grupo");

    const member = createGroupMember({
      groupId: invitation.groupId,
      userId: me.id,
      joinedAt: new Date().toISOString(),
    });
    db.groupMembers.push(member);

    return HttpResponse.json({ invitation, member }, { status: 201 });
  }),
];
