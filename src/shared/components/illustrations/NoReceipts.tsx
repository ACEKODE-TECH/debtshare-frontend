import type { SVGProps } from "react";

export function NoReceipts(props: SVGProps<SVGSVGElement>) {
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
      {/* Camera/scanner frame corners */}
      <path
        d="M5 12V7a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 5h5a2 2 0 0 1 2 2v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 28v5a2 2 0 0 1-2 2h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 35H7a2 2 0 0 1-2-2v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ticket/receipt inside */}
      <rect
        x="13"
        y="10"
        width="14"
        height="20"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
        fill="none"
      />
      <line
        x1="16"
        y1="15"
        x2="24"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="16"
        y1="19"
        x2="22"
        y2="19"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="16"
        y1="23"
        x2="23"
        y2="23"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Scan line */}
      <line
        x1="8"
        y1="20"
        x2="32"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.2"
        strokeDasharray="3 2"
      />
    </svg>
  );
}
