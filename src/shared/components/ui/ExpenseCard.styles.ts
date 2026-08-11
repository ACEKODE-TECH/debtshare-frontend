import { cva, type VariantProps } from "class-variance-authority";

export const cardStyles = cva(
  [
    "flex items-center gap-md-plus w-full rounded-xl-plus border",
    "px-lg-plus py-lg min-h-[76px]",
    "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
    "motion-reduce:transition-none",
    "cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-surface-card border-border-default",
          "hover:border-border-stronger hover:shadow-xs",
          "active:bg-surface-pressed",
        ],
        compact: [
          "bg-surface-card border-border-default",
          "hover:border-border-stronger hover:shadow-xs",
          "active:bg-surface-pressed",
          "min-h-0 py-sm-plus px-md-plus gap-sm-plus",
        ],
        settled: [
          "bg-surface-card border-border-default",
          "hover:border-border-stronger hover:shadow-xs",
          "active:bg-surface-pressed",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export const categoryIconStyles = cva("flex-none flex items-center justify-center rounded-md-plus", {
  variants: {
    size: {
      default: "h-[44px] w-[44px]",
      compact: "h-[36px] w-[36px]",
    },
  },
  defaultVariants: { size: "default" },
});

export type CardStyleProps = VariantProps<typeof cardStyles>;
