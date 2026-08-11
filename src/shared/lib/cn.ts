import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "2xs",
            "xs",
            "sm",
            "sm-plus",
            "md",
            "md-plus",
            "base",
            "lg",
            "xl",
            "xl-plus",
            "2xl",
            "3xl",
            "display-xs",
            "display-sm",
            "display-md",
            "display-lg",
            "mono-xs",
            "mono-sm",
            "mono-md",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
