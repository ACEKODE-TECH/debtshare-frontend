import { cva, type VariantProps } from "class-variance-authority";

export const tabListStyles = cva("flex", {
  variants: {
    variant: {
      underline: "gap-2xl border-b border-border-default",
      pill: "gap-sm",
      segmented: ["gap-[3px] rounded-sm-plus p-[3px]", "bg-surface-hover"],
    },
  },
  defaultVariants: { variant: "underline" },
});

export const tabStyles = cva(
  [
    "relative inline-flex items-center justify-center cursor-pointer select-none",
    "transition-colors duration-150 ease-out",
    "motion-reduce:transition-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default focus-visible:ring-offset-2",
    "disabled:opacity-40 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        underline: "py-[12px] text-lg font-bold hover:text-text-secondary",
        pill: "py-[8px] px-md rounded-sm-plus text-md font-bold",
        segmented: "py-[6px] px-md rounded-sm text-sm-plus font-semibold",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "underline", active: false, className: "text-text-tertiary" },
      { variant: "underline", active: true, className: "text-text-primary" },

      {
        variant: "pill",
        active: false,
        className: "bg-transparent text-text-tertiary border border-border-strong hover:bg-surface-hover",
      },
      {
        variant: "pill",
        active: true,
        className: "bg-brand-subtle text-brand-default border border-transparent hover:bg-brand-subtle",
      },

      { variant: "segmented", active: false, className: "text-text-tertiary" },
      { variant: "segmented", active: true, className: "bg-surface-card text-text-primary shadow-xs" },
    ],
    defaultVariants: { variant: "underline", active: false },
  },
);

export type TabListStyleProps = VariantProps<typeof tabListStyles>;
export type TabStyleProps = VariantProps<typeof tabStyles>;
