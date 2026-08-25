import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type ModalSize = "sm" | "md" | "lg";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
};

const SIZE_STYLES: Record<ModalSize, string> = {
  sm: "max-w-[420px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
};

export function Modal({ open, onOpenChange, title, description, size = "md", children, footer }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-surface-canvas/70 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            SIZE_STYLES[size],
            "flex max-h-[calc(100dvh-4rem)] flex-col overflow-hidden",
            "rounded-xl border border-border-strong bg-surface-card shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          <div className="flex items-start justify-between gap-md border-b border-border-divider px-2xl pb-lg pt-2xl">
            <div className="min-w-0">
              <Dialog.Title className="text-display-sm font-extrabold tracking-[-0.5px] text-text-primary">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-xs text-md text-text-tertiary">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Cerrar"
              className={cn(
                "flex h-[32px] w-[32px] flex-none items-center justify-center rounded-lg",
                "text-text-muted transition-colors duration-150",
                "hover:bg-surface-subtle hover:text-text-secondary",
              )}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-2xl py-xl">{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-sm border-t border-border-divider bg-surface-subtle px-2xl py-md-plus">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
