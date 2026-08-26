import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { GroupMemberWithUser } from "@/types";

export const groupMembersQueryKey = (groupId: string) => ["group-members", groupId] as const;

export function useGroupMembers(groupId: string | undefined) {
  return useQuery({
    queryKey: groupMembersQueryKey(groupId ?? ""),
    queryFn: () => api.get<GroupMemberWithUser[]>(ENDPOINTS.GROUP_MEMBERS(groupId as string)),
    enabled: !!groupId,
    staleTime: 60_000,
  });
}
