import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarGroup } from "./Avatar";

describe("Avatar", () => {
  describe("initials variant", () => {
    it("renders initials from a two-part name", () => {
      render(<Avatar variant="initials" name="María García" />);
      expect(screen.getByText("MG")).toBeInTheDocument();
    });

    it("renders a single initial from a one-part name", () => {
      render(<Avatar variant="initials" name="Admin" />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("sets role=img and aria-label to the name", () => {
      render(<Avatar variant="initials" name="Carlos López" />);
      const el = screen.getByRole("img", { name: "Carlos López" });
      expect(el).toBeInTheDocument();
    });

    it("assigns a deterministic color from the palette based on name hash", () => {
      const { container: c1 } = render(<Avatar variant="initials" name="Ana Blanco" />);
      const { container: c2 } = render(<Avatar variant="initials" name="Ana Blanco" />);
      const cls1 = c1.firstElementChild!.className;
      const cls2 = c2.firstElementChild!.className;
      expect(cls1).toBe(cls2);
    });

    it("produces different colors for different names", () => {
      const { container: c1 } = render(<Avatar variant="initials" name="Ana Blanco" />);
      const { container: c2 } = render(<Avatar variant="initials" name="Pedro Sanz" />);
      const hasBg = (cls: string) => cls.match(/bg-[\w-]+/)?.[0];
      expect(hasBg(c1.firstElementChild!.className)).not.toBe(hasBg(c2.firstElementChild!.className));
    });
  });

  describe("placeholder variant", () => {
    it("renders an SVG silhouette", () => {
      const { container } = render(<Avatar variant="placeholder" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("sets aria-label to fallback text", () => {
      render(<Avatar variant="placeholder" />);
      expect(screen.getByRole("img", { name: "Usuario sin asignar" })).toBeInTheDocument();
    });
  });

  describe("image variant", () => {
    it("renders an img element with src and alt", () => {
      render(<Avatar src="https://example.com/photo.jpg" alt="Foto de Ana" />);
      const img = screen.getByRole("img", { name: "Foto de Ana" });
      expect(img).toHaveAttribute("src", "https://example.com/photo.jpg");
    });

    it("falls back to initials on image error when fallbackInitials is provided", () => {
      render(<Avatar src="https://broken.url/404.jpg" alt="Foto rota" fallbackInitials="Foto Rota" />);
      const img = screen.getByRole("img", { name: "Foto rota" });
      fireEvent.error(img);
      expect(screen.getByText("FR")).toBeInTheDocument();
    });

    it("falls back to placeholder on image error without fallbackInitials", () => {
      const { container } = render(<Avatar src="https://broken.url/404.jpg" alt="Sin fallback" />);
      const img = screen.getByRole("img", { name: "Sin fallback" });
      fireEvent.error(img);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("sizes", () => {
    it.each([
      ["xs", "h-[20px]", "w-[20px]"],
      ["sm", "h-[28px]", "w-[28px]"],
      ["md", "h-[36px]", "w-[36px]"],
      ["lg", "h-[48px]", "w-[48px]"],
      ["xl", "h-[64px]", "w-[64px]"],
    ] as const)("applies correct dimensions for size=%s", (size, h, w) => {
      render(<Avatar variant="initials" name="Test" size={size} />);
      const cls = screen.getByRole("img").className;
      expect(cls).toContain(h);
      expect(cls).toContain(w);
    });
  });

  describe("states", () => {
    it("applies disabled styling", () => {
      render(<Avatar variant="initials" name="Disabled" state="disabled" />);
      const cls = screen.getByRole("img").className;
      expect(cls).toContain("opacity-40");
      expect(cls).toContain("grayscale");
    });

    it("applies current-user ring on lg size", () => {
      render(<Avatar variant="initials" name="Yo" size="lg" state="current-user" />);
      const cls = screen.getByRole("img").className;
      expect(cls).toContain("ring-brand-default");
    });

    it("applies selected ring and halo", () => {
      render(<Avatar variant="initials" name="Selected" state="selected" />);
      const cls = screen.getByRole("img").className;
      expect(cls).toContain("ring-2");
      expect(cls).toContain("ring-brand-default");
    });

    it("renders skeleton shimmer for loading state", () => {
      render(<Avatar variant="placeholder" state="loading" />);
      const el = screen.getByRole("img");
      expect(el.querySelector(".animate-pulse")).toBeInTheDocument();
    });
  });

  it("forwards refs to the container div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Avatar variant="initials" name="Ref Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges caller-provided className", () => {
    render(<Avatar variant="initials" name="Custom" className="mt-xl" />);
    expect(screen.getByRole("img").className).toContain("mt-xl");
  });

  it("defaults to md size", () => {
    render(<Avatar variant="initials" name="Default" />);
    expect(screen.getByRole("img").className).toContain("h-[36px]");
  });
});

describe("AvatarGroup", () => {
  it("renders up to max visible avatars and an overflow chip", () => {
    render(
      <AvatarGroup size="md" max={2}>
        <Avatar variant="initials" name="Ana Blanco" />
        <Avatar variant="initials" name="Pedro Sanz" />
        <Avatar variant="initials" name="Elena Ríos" />
        <Avatar variant="initials" name="David Mora" />
      </AvatarGroup>,
    );
    expect(screen.getByText("AB")).toBeInTheDocument();
    expect(screen.getByText("PS")).toBeInTheDocument();
    expect(screen.queryByText("ER")).not.toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("hides the overflow chip when all avatars fit", () => {
    render(
      <AvatarGroup size="sm" max={3}>
        <Avatar variant="initials" name="Ana Blanco" />
        <Avatar variant="initials" name="Pedro Sanz" />
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("has role=group with an accessible label", () => {
    render(
      <AvatarGroup size="md">
        <Avatar variant="initials" name="Test" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("group", { name: "Participantes" })).toBeInTheDocument();
  });

  it("applies negative margin for overlap on non-first items", () => {
    const { container } = render(
      <AvatarGroup size="md">
        <Avatar variant="initials" name="Ana Blanco" />
        <Avatar variant="initials" name="Pedro Sanz" />
      </AvatarGroup>,
    );
    const wrappers = container.querySelectorAll("[class*='border-2']");
    expect(wrappers[0].className).not.toContain("-ml-");
    expect(wrappers[1].className).toContain("-ml-");
  });
});
