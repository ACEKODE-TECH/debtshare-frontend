import { cva, type VariantProps } from "class-variance-authority";

export const fieldWrapperStyles = cva(
  [
    "flex items-center w-full rounded-lg border",
    "bg-surface-card-alt",
    "transition-[border-color,box-shadow] duration-150 ease-out",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      state: {
        default: [
          "border-border-strong",
          "hover:border-border-stronger",
          "focus-within:border-brand-default focus-within:shadow-[0_0_0_3px_rgba(59,110,246,0.15)]",
          "focus-within:hover:border-brand-default",
        ],
        error: ["border-feedback-danger", "shadow-[0_0_0_3px_rgba(220,38,38,0.12)]"],
        disabled: ["border-border-strong bg-surface-disabled"],
        readonly: ["border-border-readonly bg-surface-readonly"],
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export type FieldWrapperStyleProps = VariantProps<typeof fieldWrapperStyles>;
