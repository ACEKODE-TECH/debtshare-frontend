import { http, HttpResponse } from "msw";

import { groupMembers, groups, users } from "../fixtures";
import { errorResponse, randomDelayMs, shouldSimulateError } from "../utils";

export const groupHandlers = [
  http.get("/api/groups", async () => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();
    return HttpResponse.json(groups);
  }),

  http.get("/api/groups/:id", async ({ params }) => {
    await randomDelayMs();
    const group = groups.find((g) => g.id === params.id);
    if (!group) return errorResponse(404, "Grupo no encontrado");
    return HttpResponse.json(group);
  }),

  http.get("/api/groups/:id/members", async ({ params }) => {
    await randomDelayMs();
    if (shouldSimulateError()) return errorResponse();

    const members = groupMembers
      .filter((m) => m.groupId === params.id)
      .map((member) => ({ ...member, user: users.find((u) => u.id === member.userId) }));

    return HttpResponse.json(members);
  }),
];
