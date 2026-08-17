import { cn } from "@/shared/lib/cn";

interface DebtshareLogoMarkProps {
  size?: "sm" | "md";
  className?: string;
}

const sizeMap = {
  sm: { box: "w-[38px] h-[38px] rounded-[11px]", icon: 20 },
  md: { box: "w-[40px] h-[40px] rounded-lg", icon: 22 },
} as const;

export function DebtshareLogoMark({ size = "md", className }: DebtshareLogoMarkProps) {
  const s = sizeMap[size];

  return (
    <div
      className={cn(
        s.box,
        "flex items-center justify-center",
        "bg-gradient-to-br from-brand-default to-[var(--color-brand-primary-light)]",
        "shadow-md",
        className,
      )}
    >
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 2v20M2 12h20" />
      </svg>
    </div>
  );
}
