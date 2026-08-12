import type { SVGProps } from "react";

export function NoExpenses(props: SVGProps<SVGSVGElement>) {
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
      {/* Receipt body */}
      <path
        d="M10 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v30l-3.5-2.5L23 35l-3-2.5L17 35l-3.5-2.5L10 35V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Receipt lines */}
      <line x1="15" y1="11" x2="25" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="21" x2="24" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Plus circle */}
      <circle cx="31" cy="28" r="7" fill="currentColor" opacity="0.15" />
      <line x1="28" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="31" y1="25" x2="31" y2="31" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
