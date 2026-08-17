import { useMutation } from "@tanstack/react-query";

import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import type { AuthResponse, LoginPayload } from "@/types";

import { useAuthStore } from "../stores/auth-store";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => api.post<AuthResponse>(ENDPOINTS.AUTH_LOGIN, payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}

export function useGoogleLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: () =>
      api.post<AuthResponse>(ENDPOINTS.AUTH_GOOGLE, {
        credential: "mock_google_credential",
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}
