import { useQuery } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { Category } from "@/types";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => api.get<Category[]>(ENDPOINTS.CATEGORIES),
    staleTime: 5 * 60_000,
  });
}
