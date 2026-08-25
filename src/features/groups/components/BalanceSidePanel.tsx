import { useTranslation } from "react-i18next";

import { Avatar } from "@/shared/components/ui";
import { cn } from "@/shared/lib/cn";
import type { BalanceWithUser } from "@/types";

import { formatAmount } from "../lib/format";

export type BalanceSidePanelProps = {
  balances: BalanceWithUser[] | undefined;
  isPending: boolean;
  isError: boolean;
  currency: string;
  currentUserId: string | null;
};

function StarIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SkeletonRows() {
  return (
    <div className="mt-md space-y-sm">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-sm">
          <div className="h-[30px] w-[30px] flex-none animate-pulse rounded-pill bg-surface-subtle" />
          <div className="h-[13px] flex-1 animate-pulse rounded bg-surface-subtle" />
          <div className="h-[13px] w-[64px] animate-pulse rounded bg-surface-subtle" />
        </div>
      ))}
    </div>
  );
}

export function BalanceSidePanel({
  balances,
  isPending,
  isError,
  currency,
  currentUserId,
}: BalanceSidePanelProps) {
  const { t } = useTranslation("groups");
  const myBalance = balances?.find((b) => b.userId === currentUserId)?.amount ?? 0;
  const others = balances?.filter((b) => b.userId !== currentUserId && Math.abs(b.amount) > 0.005) ?? [];

  return (
    <aside className="flex flex-col gap-lg">
      <div className="rounded-2xl border border-border-divider bg-surface-card p-xl">
        <div className="text-xs font-bold uppercase tracking-[0.7px] text-text-muted">
          {t("detail.sidePanel.balanceTitle")}
        </div>

        {isPending && (
          <>
            <div className="mt-sm h-[38px] w-[180px] animate-pulse rounded bg-surface-subtle" />
            <SkeletonRows />
          </>
        )}

        {isError && <p className="mt-sm text-md text-text-tertiary">{t("detail.sidePanel.balanceError")}</p>}

        {!isPending && !isError && (
          <>
            <div className="mt-xs flex items-baseline gap-sm">
              <div
                className={cn(
                  "text-display-md font-extrabold leading-none tracking-[-1.2px]",
                  myBalance > 0
                    ? "text-feedback-success"
                    : myBalance < 0
                      ? "text-feedback-danger"
                      : "text-text-secondary",
                )}
              >
                {myBalance === 0
                  ? t("listing.balance.settled")
                  : formatAmount(myBalance, currency, { withSign: true })}
              </div>
              {myBalance > 0 && (
                <div className="text-md font-bold text-feedback-success">
                  {t("detail.sidePanel.owedToMe")}
                </div>
              )}
              {myBalance < 0 && (
                <div className="text-md font-bold text-feedback-danger">{t("detail.sidePanel.iOwe")}</div>
              )}
            </div>

            {others.length > 0 && (
              <div className="mt-lg border-t border-border-divider pt-md">
                {others.map((b) => {
                  const iOweThem = b.amount > 0;
                  return (
                    <div key={b.userId} className="flex items-center justify-between gap-sm py-sm">
                      <div className="flex min-w-0 items-center gap-sm">
                        {b.user?.avatarUrl ? (
                          <Avatar
                            variant="image"
                            size="sm"
                            src={b.user.avatarUrl}
                            alt={b.user.name}
                            fallbackInitials={b.user.name}
                          />
                        ) : (
                          <Avatar variant="initials" size="sm" name={b.user?.name ?? "?"} />
                        )}
                        <span className="truncate text-md-plus font-semibold text-text-primary">
                          {iOweThem
                            ? t("detail.sidePanel.iOweTo", { name: b.user?.name.split(" ")[0] ?? "" })
                            : t("detail.sidePanel.owesMe", { name: b.user?.name.split(" ")[0] ?? "" })}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-md-plus font-extrabold tabular-nums",
                          iOweThem ? "text-feedback-danger" : "text-feedback-success",
                        )}
                      >
                        {formatAmount(iOweThem ? -b.amount : b.amount, currency, { withSign: true })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              disabled
              className={cn(
                "mt-lg flex w-full items-center justify-center gap-sm rounded-xl bg-brand-default px-md py-md",
                "text-md font-bold text-text-on-brand shadow-md",
                "disabled:cursor-not-allowed disabled:opacity-70",
              )}
              title={t("detail.sidePanel.simplifiedComingSoon")}
            >
              <StarIcon />
              {t("detail.sidePanel.viewSimplified")}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
