import type { SVGProps } from "react";

export function AllSettled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Balance scale base */}
      <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="14" y1="32" x2="26" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Balance beam — perfectly level */}
      <line x1="8" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Left pan */}
      <path
        d="M8 14l-2 8h12l-2-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Right pan */}
      <path
        d="M24 14l-2 8h12l-2-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.08"
      />
      {/* Checkmark */}
      <circle cx="31" cy="28" r="7" fill="currentColor" opacity="0.15" />
      <path
        d="M28 28l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
