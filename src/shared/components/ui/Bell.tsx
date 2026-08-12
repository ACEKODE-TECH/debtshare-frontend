import { forwardRef, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { bellBadgeStyles, bellButtonStyles, type BellButtonStyleProps } from "./Bell.styles";

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M8 1.5A4.5 4.5 0 0 0 3.5 6v2.382a1 1 0 0 1-.106.447l-1.118 2.236A.5.5 0 0 0 2.724 12h10.553a.5.5 0 0 0 .447-.724L12.606 8.83a1 1 0 0 1-.106-.448V6A4.5 4.5 0 0 0 8 1.5Z"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 12a2 2 0 1 0 4 0"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function formatCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export type BellProps = BellButtonStyleProps & {
  count?: number;
  dotOnly?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export const Bell = forwardRef<HTMLButtonElement, BellProps>(function Bell(
  { count = 0, dotOnly = false, state, className, ...rest },
  ref,
) {
  const showBadge = count > 0;
  const prevCountRef = useRef(count);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = count;

    if (count > 0 && (prev === 0 || count > prev)) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={count > 0 ? `Notificaciones (${count > 99 ? "más de 99" : count})` : "Notificaciones"}
      className={cn(bellButtonStyles({ state }), className)}
      {...rest}
    >
      <BellIcon />
      {showBadge && (
        <span
          className={cn(
            bellBadgeStyles({ mode: dotOnly ? "dot" : "numeric" }),
            animate && "motion-safe:animate-bell-pop",
          )}
        >
          {!dotOnly && formatCount(count)}
        </span>
      )}
    </button>
  );
});
