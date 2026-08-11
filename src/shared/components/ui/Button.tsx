import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/shared/lib/cn";

import { buttonStyles, type ButtonStyleProps } from "./Button.styles";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">, ButtonStyleProps {
  /** Slot to the left of the label. Icons render at 14/16/18 px per size. */
  leftIcon?: ReactNode;
  /** Slot to the right of the label. */
  rightIcon?: ReactNode;
  /**
   * Blocks pointer events, shows a spinner and keeps the pre-loading width
   * so the button doesn't reflow. Semantically also flips `aria-busy`.
   */
  loading?: boolean;
  children?: ReactNode;
}

const Spinner = ({ size }: { size: number }) => (
  // The button carries `aria-busy` when loading — the spinner is decorative
  // and stays out of the accessibility tree via the wrapper's aria-hidden.
  <svg
    data-testid="button-spinner"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const SPINNER_SIZE_BY_BUTTON: Record<NonNullable<ButtonStyleProps["size"]>, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

function ButtonImpl(
  {
    className,
    intent,
    size,
    fullWidth,
    iconOnly,
    leftIcon,
    rightIcon,
    loading = false,
    disabled,
    children,
    type = "button",
    onClick,
    ...props
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const isDisabled = disabled ?? false;
  const isBusy = loading;
  const resolvedSize = size ?? "md";

  // While loading we DO NOT set `disabled`: that would remove the element
  // from tab order and change the focus ring, which the spec forbids. We
  // block clicks explicitly here and belt-and-braces with pointer-events-none
  // so a mouse cursor still shows the wait state.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isBusy) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        buttonStyles({ intent, size, fullWidth, iconOnly }),
        isBusy && "cursor-wait pointer-events-none",
        className,
      )}
      disabled={isDisabled}
      aria-busy={isBusy || undefined}
      data-loading={isBusy || undefined}
      onClick={handleClick}
      {...props}
    >
      <span className={cn("inline-flex items-center justify-center gap-sm", isBusy && "invisible")}>
        {leftIcon}
        {children}
        {rightIcon}
      </span>

      {isBusy && (
        <span aria-hidden="true" className="absolute inset-0 inline-flex items-center justify-center">
          <Spinner size={SPINNER_SIZE_BY_BUTTON[resolvedSize]} />
        </span>
      )}
    </button>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(ButtonImpl);
Button.displayName = "Button";
