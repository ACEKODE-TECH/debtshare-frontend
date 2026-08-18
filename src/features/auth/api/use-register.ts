import { useMutation } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { AuthResponse, RegisterPayload } from "@/types";

import { useAuthStore } from "../stores/auth-store";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => api.post<AuthResponse>(ENDPOINTS.AUTH_REGISTER, payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}
