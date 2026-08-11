import { cva, type VariantProps } from "class-variance-authority";

export const badgeStyles = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap font-extrabold leading-none",
    "transition-colors duration-150 ease-out",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        neutral: "bg-surface-hover text-text-secondary",
        brand: "bg-brand-subtle text-brand-default",
        success: "bg-feedback-success-subtle text-feedback-success",
        warning: "bg-feedback-warning-subtle-strong text-feedback-warning-strong",
        danger: "bg-feedback-danger-subtle text-feedback-danger",
        plum: "bg-accent-plum-subtle text-accent-plum",
        "solid-danger": "bg-feedback-danger text-text-on-brand",
      },
      size: {
        sm: "h-[18px] px-xs text-[10px] rounded-sm",
        md: "h-[22px] px-sm text-xs rounded-sm",
        lg: "h-[26px] px-sm-plus text-sm-plus font-bold rounded-sm-plus",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  },
);

export type BadgeStyleProps = VariantProps<typeof badgeStyles>;
