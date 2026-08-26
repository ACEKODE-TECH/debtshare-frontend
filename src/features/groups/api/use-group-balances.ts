import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { BalanceWithUser } from "@/types";

export const groupBalancesQueryKey = (groupId: string) => ["group-balances", groupId] as const;

export function useGroupBalances(groupId: string | undefined) {
  return useQuery({
    queryKey: groupBalancesQueryKey(groupId ?? ""),
    queryFn: () => api.get<BalanceWithUser[]>(ENDPOINTS.GROUP_BALANCES(groupId as string)),
    enabled: !!groupId,
  });
}
