import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classnames safely: `clsx` resolves the conditional/array
 * shape and `tailwind-merge` collapses conflicting utilities so
 * `cn("p-2", isBig && "p-4")` yields only `"p-4"` when both would apply.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
