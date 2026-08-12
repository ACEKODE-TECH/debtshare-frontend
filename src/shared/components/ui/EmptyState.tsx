import { cn } from "@/shared/lib/cn";

import {
  emptyStateContainerStyles,
  emptyStateIconStyles,
  type EmptyStateIconStyleProps,
} from "./EmptyState.styles";

type EmptyStateVariant = NonNullable<EmptyStateIconStyleProps["variant"]>;

export type EmptyStateProps = {
  variant?: EmptyStateVariant;
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  variant = "neutral",
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateContainerStyles(), className)}>
      <div className={emptyStateIconStyles({ variant })}>{icon}</div>
      <h3 className="mt-[20px] text-display-xs font-extrabold tracking-[-0.3px] text-text-primary">
        {title}
      </h3>
      <p className="mt-sm max-w-[320px] text-lg font-medium leading-relaxed text-text-tertiary">
        {description}
      </p>
      {action && <div className="mt-[20px]">{action}</div>}
      {secondaryAction && <div className="mt-md">{secondaryAction}</div>}
    </div>
  );
}
