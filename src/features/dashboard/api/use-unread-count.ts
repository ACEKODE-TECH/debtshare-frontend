import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";

interface NotificationsResponse {
  unreadCount: number;
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => api.get<NotificationsResponse>(`${ENDPOINTS.NOTIFICATIONS}?limit=1`),
    select: (data) => data.unreadCount,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
