import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  type ChangeEvent,
  type ForwardedRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/shared/lib/cn";

import { fieldWrapperStyles } from "./Input.styles";

type SharedProps = {
  label?: string;
  helpText?: string;
  error?: string;
  wrapperClassName?: string;
};

type TextFieldProps = SharedProps & {
  variant?: "text";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

type NumericFieldProps = SharedProps & {
  variant: "numeric";
  currencySymbol?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

type SearchFieldProps = SharedProps & {
  variant: "search";
  onClear?: () => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

type TextareaFieldProps = SharedProps & {
  variant: "textarea";
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export type InputProps = TextFieldProps | NumericFieldProps | SearchFieldProps | TextareaFieldProps;

const SearchIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClearIcon = () => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NUMERIC_ALLOWED = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

function resolveState(
  error: string | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined,
) {
  if (disabled) return "disabled" as const;
  if (readOnly) return "readonly" as const;
  if (error) return "error" as const;
  return "default" as const;
}

const MAX_TEXTAREA_ROWS = 6;
const LINE_HEIGHT_PX = 20;
const TEXTAREA_PY = 10;
const MAX_TEXTAREA_HEIGHT = MAX_TEXTAREA_ROWS * LINE_HEIGHT_PX + TEXTAREA_PY * 2;

function InputImpl(props: InputProps, ref: ForwardedRef<HTMLInputElement | HTMLTextAreaElement>) {
  const {
    variant = "text",
    label,
    helpText,
    error,
    disabled,
    readOnly,
    className,
    wrapperClassName,
    id: idProp,
    ...rest
  } = props;

  const autoId = useId();
  const id = idProp ?? autoId;
  const helpId = `${id}-help`;
  const state = resolveState(error, disabled, readOnly);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleNumericKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (NUMERIC_ALLOWED.has(e.key)) return;
    if (/^[0-9.,]$/.test(e.key)) return;
    e.preventDefault();
  }, []);

  const handleTextareaInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  const handleSearchClear = useCallback(() => {
    if (variant === "search" && (props as SearchFieldProps).onClear) {
      (props as SearchFieldProps).onClear!();
    }
    const input = searchInputRef.current;
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.focus();
    }
  }, [variant, props]);

  const searchVal = variant === "search" ? (rest as SearchFieldProps).value : undefined;
  const hasValue = typeof searchVal === "string" && searchVal.length > 0;

  const inputClasses = cn(
    "w-full bg-transparent outline-none",
    "font-sans text-lg font-medium leading-[20px] text-text-primary",
    "placeholder:text-text-muted",
    "disabled:cursor-not-allowed disabled:text-text-muted",
    "read-only:text-text-secondary read-only:cursor-default",
    className,
  );

  let fieldContent: ReactNode;

  if (variant === "textarea") {
    const {
      variant: _,
      label: _l,
      helpText: _h,
      error: _e,
      wrapperClassName: _w,
      ...taProps
    } = props as TextareaFieldProps;
    fieldContent = (
      <textarea
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
        id={id}
        rows={3}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={!!error || undefined}
        aria-describedby={error || helpText ? helpId : undefined}
        {...taProps}
        className={cn(inputClasses, "resize-none py-sm-plus px-md-plus")}
        onInput={(e) => {
          handleTextareaInput(e as unknown as ChangeEvent<HTMLTextAreaElement>);
          taProps.onInput?.(e);
        }}
      />
    );
  } else {
    const isNumeric = variant === "numeric";
    const isSearch = variant === "search";
    const currencySymbol = isNumeric ? (props as NumericFieldProps).currencySymbol : undefined;

    const {
      variant: _,
      label: _l,
      helpText: _h,
      error: _e,
      wrapperClassName: _w,
      ..._inputRest
    } = props as TextFieldProps | NumericFieldProps | SearchFieldProps;
    const inputRest = _inputRest as InputHTMLAttributes<HTMLInputElement>;

    if (isNumeric) {
      delete (inputRest as Record<string, unknown>).currencySymbol;
    }
    if (isSearch) {
      delete (inputRest as Record<string, unknown>).onClear;
    }

    fieldContent = (
      <>
        {isSearch && (
          <span className="flex-none pl-md-plus pr-sm text-text-muted">
            <SearchIcon />
          </span>
        )}
        {currencySymbol && (
          <span className="flex-none pl-md-plus pr-sm font-sans text-lg font-medium text-text-primary">
            {currencySymbol}
          </span>
        )}
        <input
          ref={(node) => {
            if (isSearch) (searchInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }}
          id={id}
          type="text"
          inputMode={isNumeric ? "decimal" : undefined}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error || undefined}
          aria-describedby={error || helpText ? helpId : undefined}
          {...inputRest}
          className={cn(
            inputClasses,
            "min-h-[44px] py-sm-plus",
            isSearch || currencySymbol ? "pl-sm" : "pl-md-plus",
            isSearch && hasValue ? "pr-sm" : "pr-md-plus",
            isNumeric && currencySymbol && "text-right",
          )}
          onKeyDown={(e) => {
            if (isNumeric) handleNumericKeyDown(e);
            inputRest.onKeyDown?.(e);
          }}
        />
        {isSearch && hasValue && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Limpiar búsqueda"
            onClick={handleSearchClear}
            className={cn(
              "flex-none pr-md-plus text-text-muted",
              "hover:text-text-secondary transition-colors duration-150",
            )}
          >
            <ClearIcon />
          </button>
        )}
      </>
    );
  }

  return (
    <div className={cn("flex flex-col", wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="mb-xs text-sm font-bold uppercase tracking-[0.5px] text-text-tertiary">
          {label}
        </label>
      )}

      <div className={cn(fieldWrapperStyles({ state }), variant === "textarea" && "items-start")}>
        {fieldContent}
      </div>

      {(error || helpText) && (
        <p
          id={helpId}
          className={cn(
            "mt-2xs text-md",
            error ? "font-semibold text-feedback-danger" : "font-medium text-text-tertiary",
          )}
        >
          {error || helpText}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(InputImpl);
Input.displayName = "Input";
