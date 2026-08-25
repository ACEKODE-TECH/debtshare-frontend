import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { GroupSummary } from "@/types";

export const GROUPS_QUERY_KEY = ["groups"] as const;

export function useGroups() {
  return useQuery({
    queryKey: GROUPS_QUERY_KEY,
    queryFn: () => api.get<GroupSummary[]>(ENDPOINTS.GROUPS),
    staleTime: 60_000,
  });
}
