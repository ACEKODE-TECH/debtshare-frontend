import { cva, type VariantProps } from "class-variance-authority";

export const avatarStyles = cva(
  [
    "relative inline-flex items-center justify-center rounded-pill",
    "overflow-hidden select-none",
    "transition-[box-shadow,opacity,filter] duration-150 ease-out",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        xs: "h-[20px] w-[20px]",
        sm: "h-[28px] w-[28px]",
        md: "h-[36px] w-[36px]",
        lg: "h-[48px] w-[48px]",
        xl: "h-[64px] w-[64px]",
      },
      state: {
        default: "",
        "current-user": "",
        selected: "",
        disabled: "opacity-40 grayscale",
        loading: "",
      },
    },
    compoundVariants: [
      { state: "current-user", size: "lg", className: "ring-[2.5px] ring-brand-default" },
      { state: "current-user", size: "xl", className: "ring-[2.5px] ring-brand-default" },
      { state: "selected", className: "ring-2 ring-brand-default shadow-[0_0_0_2px_rgba(59,110,246,0.2)]" },
    ],
    defaultVariants: { size: "md", state: "default" },
  },
);

export type AvatarStyleProps = VariantProps<typeof avatarStyles>;
