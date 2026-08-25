import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type FilterOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

export type FilterDropdownProps<T extends string> = {
  ariaLabel: string;
  triggerIcon?: ReactNode;
  /** Prefix shown before the current label, e.g. "Categoría". Optional. */
  triggerPrefix?: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
};

function CheckIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownSmall({ open }: { open: boolean }) {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function FilterDropdown<T extends string>({
  ariaLabel,
  triggerIcon,
  triggerPrefix,
  value,
  options,
  onChange,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center gap-xs rounded-lg border px-md py-sm text-md-plus font-semibold transition-colors duration-150",
          open
            ? "border-brand-default bg-brand-subtle text-brand-on-subtle"
            : "border-border-strong bg-surface-card text-text-secondary hover:border-border-stronger hover:text-text-primary",
        )}
      >
        {triggerIcon && <span className="text-text-muted">{triggerIcon}</span>}
        {triggerPrefix && <span className="text-text-muted">{triggerPrefix}:</span>}
        <span className="text-text-primary">{current.label}</span>
        <ChevronDownSmall open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute right-0 top-full z-30 mt-xs min-w-[220px] rounded-xl",
            "border border-border-strong bg-surface-card p-xs shadow-lg",
          )}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-sm rounded-lg px-sm-plus py-sm text-left transition-colors duration-100",
                  selected
                    ? "bg-brand-subtle text-brand-on-subtle"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary",
                )}
              >
                {option.icon && <span className="flex-none">{option.icon}</span>}
                <span className={cn("flex-1 truncate text-md", selected ? "font-bold" : "font-semibold")}>
                  {option.label}
                </span>
                {selected && (
                  <span className="text-brand-on-subtle">
                    <CheckIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
