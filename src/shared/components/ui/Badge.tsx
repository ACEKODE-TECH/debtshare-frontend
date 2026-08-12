import { forwardRef } from "react";

import { cn } from "@/shared/lib/cn";

import { badgeStyles, type BadgeStyleProps } from "./Badge.styles";

export type BadgeProps = BadgeStyleProps & {
  children: React.ReactNode;
  dot?: boolean;
  uppercase?: boolean;
  className?: string;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, size, dot, uppercase, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(badgeStyles({ variant, size }), uppercase && "uppercase tracking-[0.4px]", className)}
      {...rest}
    >
      {dot && <span className="mr-xs inline-block h-[6px] w-[6px] rounded-pill bg-current" aria-hidden />}
      {children}
    </span>
  );
});
