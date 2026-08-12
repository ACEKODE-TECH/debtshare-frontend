import { useId, useRef, useState, useEffect, useCallback } from "react";

import { cn } from "@/shared/lib/cn";

import { tabListStyles, tabStyles } from "./Tabs.styles";

export type TabItem = {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type TabsVariant = "underline" | "pill" | "segmented";

export type TabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  variant?: TabsVariant;
  className?: string;
};

export function Tabs({ items, value, onValueChange, variant = "underline", className }: TabsProps) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const updateIndicator = useCallback(() => {
    if (variant !== "underline" || !listRef.current) return;
    const activeTab = listRef.current.querySelector<HTMLElement>(`[data-tab-value="${value}"]`);
    if (!activeTab) {
      setIndicatorStyle({ opacity: 0 });
      return;
    }
    const listRect = listRef.current.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    setIndicatorStyle({
      left: tabRect.left - listRect.left,
      width: tabRect.width,
      opacity: 1,
    });
  }, [variant, value]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledItems = items.filter((i) => !i.disabled);
    const currentIdx = enabledItems.findIndex((i) => i.value === value);
    let nextIdx = -1;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIdx = (currentIdx + 1) % enabledItems.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIdx = (currentIdx - 1 + enabledItems.length) % enabledItems.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = enabledItems.length - 1;
    }

    if (nextIdx >= 0) {
      onValueChange(enabledItems[nextIdx].value);
      const nextTab = listRef.current?.querySelector<HTMLElement>(
        `[data-tab-value="${enabledItems[nextIdx].value}"]`,
      );
      nextTab?.focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(tabListStyles({ variant }), "relative", className)}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            id={`${id}-tab-${item.value}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`${id}-panel-${item.value}`}
            tabIndex={isActive ? 0 : -1}
            disabled={item.disabled}
            data-tab-value={item.value}
            className={cn(tabStyles({ variant, active: isActive }))}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
            {item.count != null && <span className="ml-xs text-text-tertiary"> · {item.count}</span>}
          </button>
        );
      })}
      {variant === "underline" && (
        <span
          className="absolute bottom-0 h-[2px] bg-brand-default transition-all duration-150 ease-out motion-reduce:transition-none"
          style={indicatorStyle}
          aria-hidden
        />
      )}
    </div>
  );
}
