import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";
import type { Group } from "@/types";

import { api } from "./api";

describe("api client", () => {
  it("parses a successful JSON response against the mocked backend", async () => {
    // Overrides the handler to sidestep its randomized error simulation and keep this test deterministic.
    server.use(http.get("/api/groups", () => HttpResponse.json([{ id: "group_1", name: "Viaje a Lisboa" }])));

    const groups = await api.get<Group[]>("/groups");
    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0]).toHaveProperty("name");
  });

  it("throws ApiError with a 404 status for an unknown resource", async () => {
    await expect(api.get("/users/does-not-exist")).rejects.toMatchObject({ status: 404 });
  });
});
