import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { Modal } from "@/shared/components/ui";
import { cn } from "@/shared/lib/cn";
import type { GroupSummary } from "@/types";

import { getGroupEmoji, getGroupIconTint } from "../lib/group-icons";
import { useActiveGroupStore } from "../stores/active-group-store";

export type PickGroupForExpenseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: GroupSummary[];
};

/**
 * Lightweight picker shown when the user triggers "Nuevo gasto" from the command
 * palette without a group context (e.g. from the groups listing). Selecting a
 * group navigates to its detail with `?action=new-expense` so the actual expense
 * modal opens right after.
 */
export function PickGroupForExpenseModal({ open, onOpenChange, groups }: PickGroupForExpenseModalProps) {
  const { t } = useTranslation("groups");
  const navigate = useNavigate();
  const setActiveGroup = useActiveGroupStore((s) => s.setActiveGroup);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("pickGroup.title")}
      description={t("pickGroup.description")}
      size="sm"
    >
      <div className="flex flex-col gap-xs">
        {groups.map((g) => {
          const tint = getGroupIconTint(g.icon);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setActiveGroup(g.id);
                onOpenChange(false);
                navigate(`/app/groups/${g.id}?action=new-expense`);
              }}
              className={cn(
                "flex w-full items-center gap-sm rounded-xl border border-border-divider bg-surface-card px-md py-sm-plus text-left",
                "transition-colors duration-150 hover:border-brand-default hover:bg-surface-subtle",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-default",
              )}
            >
              <span
                className={cn(
                  "flex h-[36px] w-[36px] flex-none items-center justify-center rounded-lg text-lg",
                  tint.bg,
                  tint.fg,
                )}
                aria-hidden
              >
                {getGroupEmoji(g.icon)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-md-plus font-bold text-text-primary">{g.name}</div>
                <div className="text-xs font-medium text-text-muted">
                  {g.memberCount} · {g.currency}
                </div>
              </div>
              <svg
                width={13}
                height={13}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-text-muted"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
