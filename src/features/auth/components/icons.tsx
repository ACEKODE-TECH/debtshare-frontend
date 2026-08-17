interface IconProps {
  className?: string;
}

const STROKE_DEFAULTS = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" className={className} {...STROKE_DEFAULTS}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" className={className} {...STROKE_DEFAULTS}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" className={className} {...STROKE_DEFAULTS}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon({ className }: IconProps) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" className={className} {...STROKE_DEFAULTS}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="var(--color-accent-mustard)" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-on-brand)"
      strokeWidth="3.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
