import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const prevKeyRef = useRef(routeKey);

  useEffect(() => {
    if (routeKey !== prevKeyRef.current) {
      prevKeyRef.current = routeKey;
      setVisible(false);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [routeKey]);

  return (
    <div
      className={cn(
        "h-full transition-[opacity,transform] duration-200 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
      )}
    >
      {children}
    </div>
  );
}
