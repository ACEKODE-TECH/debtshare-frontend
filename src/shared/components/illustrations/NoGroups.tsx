import type { SVGProps } from "react";

export function NoGroups(props: SVGProps<SVGSVGElement>) {
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
      {/* Center person */}
      <circle cx="20" cy="13" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M12 30c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left person (faded) */}
      <circle cx="9" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.35" fill="none" />
      <path
        d="M3 29c0-3.314 2.686-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Right person (faded) */}
      <circle cx="31" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.35" fill="none" />
      <path
        d="M37 29c0-3.314-2.686-6-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Dashed connection lines */}
      <line
        x1="13.5"
        y1="14"
        x2="15"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        opacity="0.3"
      />
      <line
        x1="25"
        y1="13.5"
        x2="26.5"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        opacity="0.3"
      />
    </svg>
  );
}
