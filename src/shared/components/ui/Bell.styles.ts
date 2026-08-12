import { cva, type VariantProps } from "class-variance-authority";

export const bellButtonStyles = cva(
  [
    "relative inline-flex items-center justify-center",
    "h-[36px] w-[36px] rounded-md-plus",
    "border border-border-strong bg-surface-card",
    "transition-colors duration-150 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default focus-visible:ring-offset-2",
    "disabled:opacity-40 disabled:pointer-events-none",
  ],
  {
    variants: {
      state: {
        default: "text-text-secondary hover:bg-surface-hover active:bg-surface-pressed",
        open: "bg-brand-subtle text-brand-default border-transparent",
      },
    },
    defaultVariants: { state: "default" },
  },
);

export const bellBadgeStyles = cva(
  [
    "absolute flex items-center justify-center",
    "border-2 border-surface-card",
    "bg-feedback-danger text-text-on-brand",
    "text-2xs font-extrabold leading-none",
  ],
  {
    variants: {
      mode: {
        numeric: "h-[16px] min-w-[16px] rounded-pill px-[4px] -top-[4px] -right-[4px]",
        dot: "h-[8px] w-[8px] rounded-pill -top-[2px] -right-[2px]",
      },
    },
    defaultVariants: { mode: "numeric" },
  },
);

export type BellButtonStyleProps = VariantProps<typeof bellButtonStyles>;
export type BellBadgeStyleProps = VariantProps<typeof bellBadgeStyles>;
