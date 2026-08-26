import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { Group } from "@/types";

export const groupQueryKey = (id: string) => ["group", id] as const;

export function useGroup(id: string | undefined) {
  return useQuery({
    queryKey: groupQueryKey(id ?? ""),
    queryFn: () => api.get<Group>(ENDPOINTS.GROUP(id as string)),
    enabled: !!id,
    staleTime: 60_000,
  });
}
