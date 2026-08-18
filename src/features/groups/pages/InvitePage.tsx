import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";

import { useAuthStore } from "@/features/auth/stores/auth-store";
import { ENDPOINTS } from "@/lib/endpoints";
import { api } from "@/shared/lib/api";
import { ApiError } from "@/shared/lib/api";
import type { Group, GroupInvitation } from "@/types";

interface InviteResolveResponse {
  invitation: GroupInvitation;
  group: Group | null;
}

export function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading, error } = useQuery({
    queryKey: ["invite", token],
    queryFn: () => api.get<InviteResolveResponse>(ENDPOINTS.INVITATION_RESOLVE(token!)),
    enabled: !!token,
    retry: false,
  });

  const join = useMutation({
    mutationFn: () => api.post(ENDPOINTS.INVITATION_RESOLVE(token!)),
    onSuccess: () => {
      navigate(`/app/groups/${data?.invitation.groupId}`, { replace: true });
    },
  });

  if (!isAuthenticated) {
    const returnTo = `/invite/${token}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface-bg">
        <div className="text-text-muted">{t("invite.loading")}</div>
      </div>
    );
  }

  if (error || !data) {
    const message = error instanceof ApiError ? error.message : t("invite.invalidLink");
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-lg bg-surface-bg px-xl">
        <div className="flex h-[56px] w-[56px] items-center justify-center rounded-pill bg-status-error-bg text-2xl">
          !
        </div>
        <h1 className="text-lg font-bold text-text-primary">{t("invite.errorTitle")}</h1>
        <p className="max-w-sm text-center text-text-secondary">{message}</p>
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="rounded-lg bg-brand-default px-xl py-sm-plus text-sm font-semibold text-text-on-brand transition-colors hover:bg-brand-hover"
        >
          {t("invite.goHome")}
        </button>
      </div>
    );
  }

  const { group, invitation } = data;
  const apiError = join.error instanceof ApiError ? join.error.message : null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-xl bg-surface-bg px-xl">
      <div className="flex h-[64px] w-[64px] items-center justify-center rounded-2xl bg-brand-subtle text-3xl">
        👥
      </div>

      <div className="text-center">
        <h1 className="text-display-sm font-extrabold tracking-[-0.6px] text-text-primary">
          {t("invite.title")}
        </h1>
        {group && (
          <p className="mt-sm text-lg text-text-secondary">{t("invite.groupName", { name: group.name })}</p>
        )}
        {group?.description && <p className="mt-xs text-sm text-text-muted">{group.description}</p>}
      </div>

      {apiError && <p className="text-sm text-status-error-text">{apiError}</p>}

      <div className="flex gap-md">
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="rounded-lg border border-border-strong bg-surface-card px-xl py-sm-plus text-sm font-semibold text-text-primary transition-colors hover:bg-surface-subtle"
        >
          {t("invite.decline")}
        </button>
        <button
          type="button"
          onClick={() => join.mutate()}
          disabled={join.isPending || invitation.status !== "pending"}
          className="rounded-lg bg-brand-default px-xl py-sm-plus text-sm font-semibold text-text-on-brand transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {join.isPending ? t("invite.joining") : t("invite.accept")}
        </button>
      </div>
    </div>
  );
}
