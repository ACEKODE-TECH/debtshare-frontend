import { cva, type VariantProps } from "class-variance-authority";

/**
 * Visual contract for Button. Kept in its own module so Vite's fast-refresh
 * treats Button.tsx as a component-only file — HMR stays instant when the
 * variant table grows in later iterations.
 *
 * Spec: docs/design-system-components.md § Button.
 * Only semantic tokens are referenced (`bg-brand-default`, `text-text-primary`,
 * ...); no primitive class ever lands here.
 */
export const buttonStyles = cva(
  [
    "relative inline-flex items-center justify-center whitespace-nowrap select-none",
    "font-sans font-bold leading-none",
    "rounded-lg border border-transparent",
    "transition-[background-color,box-shadow,transform,color,border-color]",
    "duration-150 ease-out motion-reduce:transition-none",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-brand-default text-text-on-brand shadow-lg",
          "hover:bg-brand-hover hover:shadow-lg-alt",
          "active:bg-brand-pressed active:shadow-md active:translate-y-px",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-ring",
          "disabled:bg-brand-disabled-bg disabled:text-brand-disabled-text disabled:shadow-none",
        ],
        secondary: [
          "bg-surface-card-alt text-text-primary border-border-strong",
          "hover:bg-surface-hover",
          "active:bg-surface-pressed",
          "focus-visible:ring-2 focus-visible:ring-brand-default",
          "disabled:opacity-50 disabled:text-text-muted",
        ],
        ghost: [
          "bg-transparent text-text-secondary",
          "hover:bg-surface-hover",
          "active:bg-surface-pressed",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-default",
          "disabled:opacity-40",
        ],
        destructive: [
          "bg-feedback-danger text-text-on-brand",
          "hover:brightness-[.92]",
          "active:brightness-[.86]",
          "focus-visible:ring-2 focus-visible:ring-feedback-danger-ring",
          "disabled:bg-feedback-danger-subtle-strong disabled:text-feedback-danger disabled:opacity-50",
        ],
      },
      size: {
        // Heights (32/44/52) aren't in the general spacing scale — kept as
        // arbitrary values so they stay documented at the point of use.
        sm: "min-h-[32px] px-md gap-sm text-md",
        md: "min-h-[44px] px-lg gap-sm text-lg",
        lg: "min-h-[52px] px-xl gap-sm text-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      iconOnly: {
        true: "p-0",
        false: "",
      },
    },
    compoundVariants: [
      // Icon-only keeps `alto == ancho` per spec, radius unchanged.
      { iconOnly: true, size: "sm", className: "w-[32px] min-w-[32px]" },
      { iconOnly: true, size: "md", className: "w-[44px] min-w-[44px]" },
      { iconOnly: true, size: "lg", className: "w-[52px] min-w-[52px]" },
    ],
    defaultVariants: {
      intent: "primary",
      size: "md",
      fullWidth: false,
      iconOnly: false,
    },
  },
);

export type ButtonStyleProps = VariantProps<typeof buttonStyles>;
