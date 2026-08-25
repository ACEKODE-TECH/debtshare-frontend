import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { CreateGroupRequest, Group } from "@/types";

import { GROUPS_QUERY_KEY } from "./use-groups";

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupRequest) => api.post<Group>(ENDPOINTS.GROUPS, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GROUPS_QUERY_KEY });
    },
  });
}
