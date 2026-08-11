import { Children, forwardRef, useState, type ImgHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

import { avatarStyles } from "./Avatar.styles";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarState = "default" | "current-user" | "selected" | "disabled" | "loading";

type BaseProps = {
  size?: AvatarSize;
  state?: AvatarState;
  className?: string;
};

type ImageProps = BaseProps & {
  variant?: "image";
  src: string;
  alt: string;
  fallbackInitials?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "size">;

type InitialsProps = BaseProps & {
  variant: "initials";
  name: string;
};

type PlaceholderProps = BaseProps & {
  variant: "placeholder";
};

export type AvatarProps = ImageProps | InitialsProps | PlaceholderProps;

const INITIALS_FONT: Record<AvatarSize, string> = {
  xs: "text-[9px] font-bold",
  sm: "text-[11px] font-bold",
  md: "text-[13px] font-extrabold",
  lg: "text-[17px] font-extrabold",
  xl: "text-[22px] font-extrabold",
};

const TINT_PALETTE = [
  { bg: "bg-brand-subtle", fg: "text-brand-default" },
  { bg: "bg-feedback-success-subtle", fg: "text-feedback-success" },
  { bg: "bg-accent-mustard-subtle", fg: "text-accent-mustard-strong" },
  { bg: "bg-accent-plum-subtle", fg: "text-accent-plum" },
  { bg: "bg-feedback-danger-subtle", fg: "text-feedback-danger" },
  { bg: "bg-brand-secondary-subtle", fg: "text-brand-secondary" },
  { bg: "bg-feedback-warning-subtle-strong", fg: "text-feedback-warning-strong" },
  { bg: "bg-feedback-success-subtle-strong", fg: "text-feedback-success" },
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PLACEHOLDER_ICON: Record<AvatarSize, { w: number; h: number }> = {
  xs: { w: 12, h: 12 },
  sm: { w: 16, h: 16 },
  md: { w: 20, h: 20 },
  lg: { w: 26, h: 26 },
  xl: { w: 34, h: 34 },
};

function PlaceholderSvg({ size }: { size: AvatarSize }) {
  const { w, h } = PLACEHOLDER_ICON[size];
  return (
    <svg width={w} height={h} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="7.5" r="3.5" fill="currentColor" />
      <path d="M3 17.5c0-3.5 3-5.5 7-5.5s7 2 7 5.5" fill="currentColor" />
    </svg>
  );
}

function SkeletonShimmer() {
  return <div className="absolute inset-0 animate-pulse bg-surface-subtle" />;
}

function AvatarImpl(props: AvatarProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { size = "md", state = "default", className, ...rest } = props;

  const isLoading = state === "loading";

  let content: React.ReactNode;
  let bgClass = "";

  if (props.variant === "placeholder" || isLoading) {
    bgClass = "bg-surface-subtle text-text-muted";
    content = isLoading ? <SkeletonShimmer /> : <PlaceholderSvg size={size} />;
  } else if (props.variant === "initials") {
    const tint = TINT_PALETTE[hashName(props.name) % TINT_PALETTE.length];
    bgClass = cn(tint.bg, tint.fg);
    content = <span className={cn("leading-none", INITIALS_FONT[size])}>{getInitials(props.name)}</span>;
  } else {
    content = <ImageContent {...props} size={size} />;
  }

  const isImage = !props.variant || props.variant === "image";

  const {
    variant: _v,
    name: _n,
    src: _src,
    alt: _alt,
    fallbackInitials: _fi,
    ...htmlRest
  } = rest as Record<string, unknown>;

  return (
    <div
      ref={ref}
      className={cn(avatarStyles({ size, state }), bgClass, className)}
      {...(!isImage && { role: "img" })}
      aria-label={
        props.variant === "initials"
          ? props.name
          : props.variant === "placeholder"
            ? "Usuario sin asignar"
            : undefined
      }
      {...(htmlRest as Record<string, unknown>)}
    >
      {content}
    </div>
  );
}

function ImageContent({ src, alt, fallbackInitials, size, ...imgRest }: ImageProps & { size: AvatarSize }) {
  const [failed, setFailed] = useState(false);

  if (failed && fallbackInitials) {
    const tint = TINT_PALETTE[hashName(fallbackInitials) % TINT_PALETTE.length];
    return (
      <div className={cn("flex h-full w-full items-center justify-center", tint.bg, tint.fg)}>
        <span className={cn("leading-none", INITIALS_FONT[size])}>{getInitials(fallbackInitials)}</span>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-surface-subtle text-text-muted">
        <PlaceholderSvg size={size} />
      </div>
    );
  }

  const {
    variant: _,
    fallbackInitials: _fi,
    state: _s,
    size: _sz,
    ...safeImgRest
  } = imgRest as Record<string, unknown>;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
      {...(safeImgRest as Record<string, unknown>)}
    />
  );
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(AvatarImpl);
Avatar.displayName = "Avatar";

export type AvatarGroupProps = {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
};

export function AvatarGroup({ children, max = 3, size = "md", className }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - max;

  const OVERLAP: Record<AvatarSize, string> = {
    xs: "-ml-[6px]",
    sm: "-ml-[8px]",
    md: "-ml-[11px]",
    lg: "-ml-[14px]",
    xl: "-ml-[19px]",
  };

  const SIZES: Record<AvatarSize, string> = {
    xs: "h-[20px] w-[20px]",
    sm: "h-[28px] w-[28px]",
    md: "h-[36px] w-[36px]",
    lg: "h-[48px] w-[48px]",
    xl: "h-[64px] w-[64px]",
  };

  return (
    <div className={cn("flex items-center", className)} role="group" aria-label="Participantes">
      {visible.map((child, i) => (
        <div key={i} className={cn("rounded-pill border-2 border-surface-bg", i > 0 && OVERLAP[size])}>
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-pill",
            "border-2 border-surface-bg",
            "bg-surface-subtle font-sans text-sm font-extrabold text-text-secondary",
            SIZES[size],
            OVERLAP[size],
          )}
          aria-label={`${overflow} ${overflow === 1 ? "participante" : "participantes"} más`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
