import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Avatar, AvatarGroup } from "@/shared/components/ui";
import { cn } from "@/shared/lib/cn";
import type { GroupSummary } from "@/types";

import { formatAmount, formatRelativeTime } from "../lib/format";
import { getGroupEmoji, getGroupIconTint } from "../lib/group-icons";

export type GroupCardProps = {
  group: GroupSummary;
  onOpen?: () => void;
};

function StatusPill({ status }: { status: GroupSummary["status"] }) {
  const { t } = useTranslation("groups");
  if (status === "settled") {
    return (
      <span className="inline-flex items-center gap-2xs rounded-md bg-surface-subtle px-sm py-2xs text-[10.5px] font-bold text-text-muted">
        <span className="h-[5px] w-[5px] rounded-pill bg-text-muted/70" aria-hidden />
        {t("listing.status.settled")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2xs rounded-md bg-feedback-success-subtle px-sm py-2xs text-[10.5px] font-bold text-feedback-success">
      <span className="h-[5px] w-[5px] rounded-pill bg-feedback-success" aria-hidden />
      {t("listing.status.active")}
    </span>
  );
}

function Balance({
  balance,
  currency,
  status,
}: {
  balance: number;
  currency: string;
  status: GroupSummary["status"];
}) {
  const { t } = useTranslation("groups");

  if (status === "settled") {
    return (
      <div>
        <div className="text-[11px] font-semibold text-text-muted">{t("listing.balance.stateLabel")}</div>
        <div className="mt-2xs text-[20px] font-extrabold tracking-[-0.4px] text-text-secondary">
          {t("listing.balance.settled")}
        </div>
      </div>
    );
  }
  if (balance > 0) {
    return (
      <div>
        <div className="text-[11px] font-semibold text-text-muted">{t("listing.balance.owedToMe")}</div>
        <div className="mt-2xs text-[20px] font-extrabold tracking-[-0.4px] text-feedback-success">
          {formatAmount(balance, currency, { withSign: true })}
        </div>
      </div>
    );
  }
  if (balance < 0) {
    return (
      <div>
        <div className="text-[11px] font-semibold text-text-muted">{t("listing.balance.iOwe")}</div>
        <div className="mt-2xs text-[20px] font-extrabold tracking-[-0.4px] text-feedback-danger">
          {formatAmount(balance, currency, { withSign: true })}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-[11px] font-semibold text-text-muted">{t("listing.balance.stateLabel")}</div>
      <div className="mt-2xs text-[20px] font-extrabold tracking-[-0.4px] text-text-secondary">
        {t("listing.balance.zero")}
      </div>
    </div>
  );
}

export function GroupCard({ group, onOpen }: GroupCardProps) {
  const { t } = useTranslation("groups");
  const tint = getGroupIconTint(group.icon);
  const relative = formatRelativeTime(group.lastActivityAt);

  return (
    <Link
      to={`/app/groups/${group.id}`}
      onClick={onOpen}
      className={cn(
        "group flex min-h-[220px] flex-col rounded-[14px] border border-border-divider bg-surface-card p-lg-plus",
        "shadow-xs transition-all duration-150",
        "hover:border-border-strong hover:shadow-md",
        "focus:outline-none focus-visible:border-brand-default focus-visible:shadow-[0_0_0_3px_var(--color-brand-primary-tint-alt)]",
      )}
    >
      {/* Header: icon + status */}
      <div className="mb-md flex items-start justify-between">
        <span
          className={cn(
            "flex h-[48px] w-[48px] flex-none items-center justify-center rounded-[14px] text-xl",
            tint.bg,
            tint.fg,
          )}
          aria-hidden
        >
          {getGroupEmoji(group.icon)}
        </span>
        <StatusPill status={group.status} />
      </div>

      {/* Name */}
      <div className="truncate text-[16px] font-bold tracking-[-0.2px] text-text-primary">{group.name}</div>

      {/* Avatars + counts */}
      <div className="mt-sm flex items-center gap-sm">
        {group.memberPreview.length > 0 && (
          <AvatarGroup max={3} size="sm">
            {group.memberPreview.map((m) =>
              m.avatarUrl ? (
                <Avatar
                  key={m.id}
                  variant="image"
                  size="sm"
                  src={m.avatarUrl}
                  alt={m.name}
                  fallbackInitials={m.name}
                />
              ) : (
                <Avatar key={m.id} variant="initials" size="sm" name={m.name} />
              ),
            )}
            {group.memberCount > group.memberPreview.length &&
              Array.from({ length: group.memberCount - group.memberPreview.length }).map((_, i) => (
                <Avatar key={`ph-${i}`} variant="placeholder" size="sm" />
              ))}
          </AvatarGroup>
        )}
        <span className="text-[12px] font-medium text-text-muted">
          {t("listing.memberCount", { count: group.memberCount })}
          {" · "}
          {t("listing.expenseCount", { count: group.expenseCount })}
        </span>
      </div>

      {/* Footer: balance + relative time */}
      <div className="mt-auto flex items-end justify-between border-t border-border-divider pt-md-plus">
        <Balance balance={group.myBalance} currency={group.currency} status={group.status} />
        {relative && <span className="text-[11px] font-medium text-text-muted">{relative}</span>}
      </div>
    </Link>
  );
}
