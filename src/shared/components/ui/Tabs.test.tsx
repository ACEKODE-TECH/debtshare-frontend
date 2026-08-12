import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tabs, type TabItem } from "./Tabs";

const ITEMS: TabItem[] = [
  { value: "all", label: "Todos", count: 12 },
  { value: "pending", label: "Pendientes", count: 3 },
  { value: "settled", label: "Saldados" },
];

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  const onChange = vi.fn();
  const result = render(
    <Tabs
      items={props.items ?? ITEMS}
      value={props.value ?? "all"}
      onValueChange={props.onValueChange ?? onChange}
      variant={props.variant}
      className={props.className}
    />,
  );
  return { ...result, onChange };
}

describe("Tabs", () => {
  it("renders all tab labels", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: /Todos/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Pendientes/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Saldados/ })).toBeInTheDocument();
  });

  it("marks the active tab with aria-selected", () => {
    renderTabs({ value: "pending" });
    expect(screen.getByRole("tab", { name: /Pendientes/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Todos/ })).toHaveAttribute("aria-selected", "false");
  });

  it("renders a count suffix when provided", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: /Todos/ }).textContent).toContain("· 12");
    expect(screen.getByRole("tab", { name: /Saldados/ }).textContent).not.toContain("·");
  });

  it("calls onValueChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const { onChange } = renderTabs();
    await user.click(screen.getByRole("tab", { name: /Pendientes/ }));
    expect(onChange).toHaveBeenCalledWith("pending");
  });

  it("does not call onValueChange for disabled tabs", async () => {
    const user = userEvent.setup();
    const items: TabItem[] = [
      { value: "a", label: "A" },
      { value: "b", label: "B", disabled: true },
    ];
    const { onChange } = renderTabs({ items, value: "a" });
    await user.click(screen.getByRole("tab", { name: "B" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("navigates tabs with arrow keys", async () => {
    const user = userEvent.setup();
    const { onChange } = renderTabs();
    const firstTab = screen.getByRole("tab", { name: /Todos/ });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("pending");
  });

  it("wraps around with arrow keys", async () => {
    const user = userEvent.setup();
    const { onChange } = renderTabs({ value: "settled" });
    const lastTab = screen.getByRole("tab", { name: /Saldados/ });
    lastTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("has role=tablist on the container", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  describe("underline variant", () => {
    it("renders the animated indicator bar", () => {
      const { container } = renderTabs({ variant: "underline" });
      const indicator = container.querySelector("[aria-hidden]");
      expect(indicator).toBeInTheDocument();
      expect(indicator!.className).toContain("bg-brand-default");
      expect(indicator!.className).toContain("h-[2px]");
    });

    it("applies bottom border on the container", () => {
      renderTabs({ variant: "underline" });
      expect(screen.getByRole("tablist").className).toContain("border-b");
    });
  });

  describe("pill variant", () => {
    it("applies brand bg to the active tab", () => {
      renderTabs({ variant: "pill" });
      const active = screen.getByRole("tab", { name: /Todos/ });
      expect(active.className).toContain("bg-brand-subtle");
      expect(active.className).toContain("text-brand-default");
    });

    it("applies border to inactive tabs", () => {
      renderTabs({ variant: "pill" });
      const inactive = screen.getByRole("tab", { name: /Pendientes/ });
      expect(inactive.className).toContain("border-border-strong");
    });
  });

  describe("segmented variant", () => {
    it("applies card bg and shadow to active tab", () => {
      renderTabs({ variant: "segmented" });
      const active = screen.getByRole("tab", { name: /Todos/ });
      expect(active.className).toContain("bg-surface-card");
      expect(active.className).toContain("shadow-xs");
    });

    it("applies surface-hover bg on the container", () => {
      renderTabs({ variant: "segmented" });
      expect(screen.getByRole("tablist").className).toContain("bg-surface-hover");
    });
  });

  it("merges caller-provided className on the container", () => {
    renderTabs({ className: "mt-xl" });
    expect(screen.getByRole("tablist").className).toContain("mt-xl");
  });
});
