import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { Group } from "@/types";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => api.get<Group[]>(ENDPOINTS.GROUPS),
    staleTime: 60_000,
  });
}
