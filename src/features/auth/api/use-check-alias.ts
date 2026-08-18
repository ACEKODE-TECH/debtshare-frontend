import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";

interface CheckAliasResponse {
  available: boolean;
}

export function useCheckAlias(alias: string) {
  const trimmed = alias.trim().toLowerCase();
  const enabled = trimmed.length >= 3;

  return useQuery({
    queryKey: ["alias-check", trimmed],
    queryFn: () => api.get<CheckAliasResponse>(ENDPOINTS.CHECK_ALIAS(trimmed)),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}
