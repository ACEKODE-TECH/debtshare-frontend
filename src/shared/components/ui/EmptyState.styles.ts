import { cva, type VariantProps } from "class-variance-authority";

export const emptyStateContainerStyles = cva(["flex flex-col items-center text-center", "px-2xl py-4xl"]);

export const emptyStateIconStyles = cva("flex items-center justify-center rounded-pill h-[72px] w-[72px]", {
  variants: {
    variant: {
      neutral: "bg-surface-hover text-text-tertiary",
      success: "bg-feedback-success-subtle text-feedback-success",
      error: "bg-feedback-danger-subtle text-feedback-danger",
      search: "bg-brand-subtle text-brand-default",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export type EmptyStateIconStyleProps = VariantProps<typeof emptyStateIconStyles>;
