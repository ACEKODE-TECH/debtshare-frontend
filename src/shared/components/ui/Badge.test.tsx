import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its text content", () => {
    render(<Badge>Pendiente</Badge>);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("defaults to neutral variant and md size", () => {
    render(<Badge>Tag</Badge>);
    const el = screen.getByText("Tag");
    expect(el.className).toContain("bg-surface-hover");
    expect(el.className).toContain("text-text-secondary");
    expect(el.className).toContain("h-[22px]");
  });

  describe("variants", () => {
    it.each([
      ["brand", "bg-brand-subtle", "text-brand-default"],
      ["success", "bg-feedback-success-subtle", "text-feedback-success"],
      ["warning", "bg-feedback-warning-subtle-strong", "text-feedback-warning-strong"],
      ["danger", "bg-feedback-danger-subtle", "text-feedback-danger"],
      ["plum", "bg-accent-plum-subtle", "text-accent-plum"],
      ["solid-danger", "bg-feedback-danger", "text-text-on-brand"],
    ] as const)("applies correct classes for variant=%s", (variant, bg, fg) => {
      render(<Badge variant={variant}>Test</Badge>);
      const cls = screen.getByText("Test").className;
      expect(cls).toContain(bg);
      expect(cls).toContain(fg);
    });
  });

  describe("sizes", () => {
    it.each([
      ["sm", "h-[18px]", "px-xs"],
      ["md", "h-[22px]", "px-sm"],
      ["lg", "h-[26px]", "px-sm-plus"],
    ] as const)("applies correct dimensions for size=%s", (size, h, px) => {
      render(<Badge size={size}>Test</Badge>);
      const cls = screen.getByText("Test").className;
      expect(cls).toContain(h);
      expect(cls).toContain(px);
    });
  });

  it("renders a dot when dot prop is true", () => {
    const { container } = render(<Badge dot>Activo</Badge>);
    const dot = container.querySelector(".rounded-pill.bg-current");
    expect(dot).toBeInTheDocument();
    expect(dot!.className).toContain("h-[6px]");
    expect(dot!.className).toContain("w-[6px]");
  });

  it("does not render a dot by default", () => {
    const { container } = render(<Badge>Sin punto</Badge>);
    expect(container.querySelector(".bg-current")).not.toBeInTheDocument();
  });

  it("applies uppercase tracking when uppercase prop is true", () => {
    render(<Badge uppercase>Saldado</Badge>);
    const cls = screen.getByText("Saldado").className;
    expect(cls).toContain("uppercase");
    expect(cls).toContain("tracking-");
  });

  it("forwards refs", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("merges caller-provided className", () => {
    render(<Badge className="ml-sm">Custom</Badge>);
    expect(screen.getByText("Custom").className).toContain("ml-sm");
  });
});
