import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders its label with the default primary/md variant", () => {
    render(<Button>Guardar gasto</Button>);
    const button = screen.getByRole("button", { name: "Guardar gasto" });
    // Default intent = primary → bg-brand-default is one of the utilities on it.
    expect(button.className).toContain("bg-brand-default");
    // Default size = md → 44 px min height.
    expect(button.className).toContain("min-h-[44px]");
  });

  it("defaults `type` to `button` so it does not submit the parent form implicitly", () => {
    render(<Button>Cancelar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("switches classes when the intent variant changes", () => {
    const { rerender } = render(<Button intent="secondary">Ver más</Button>);
    expect(screen.getByRole("button").className).toContain("bg-surface-card-alt");

    rerender(<Button intent="ghost">Ver más</Button>);
    expect(screen.getByRole("button").className).toContain("bg-transparent");

    rerender(<Button intent="destructive">Ver más</Button>);
    expect(screen.getByRole("button").className).toContain("bg-feedback-danger");
  });

  it("switches classes when the size variant changes", () => {
    const { rerender } = render(<Button size="sm">Filtrar</Button>);
    expect(screen.getByRole("button").className).toContain("min-h-[32px]");

    rerender(<Button size="lg">Filtrar</Button>);
    expect(screen.getByRole("button").className).toContain("min-h-[52px]");
  });

  it("makes an icon-only button as tall as it is wide", () => {
    render(
      <Button iconOnly size="md" aria-label="Buscar">
        <svg data-testid="glyph" />
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Buscar" });
    // Icon-only overrides padding to 0 and pins width to the height.
    expect(button.className).toContain("w-[44px]");
    expect(button.className).toContain("p-0");
  });

  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>OK</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        OK
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  describe("when loading", () => {
    it("sets aria-busy, blocks pointer events and hides the label without removing it", () => {
      render(<Button loading>Guardar</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(button.className).toContain("pointer-events-none");
      // The label span is present but hidden (keeps the pre-loading width).
      const label = screen.getByText("Guardar");
      expect(label).toBeInTheDocument();
      expect(label.className).toContain("invisible");
    });

    it("swallows clicks", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Guardar
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("renders a spinner (decorative — accessibility comes from aria-busy on the button)", () => {
      render(<Button loading>Guardar</Button>);
      expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
    });
  });

  it("forwards refs to the underlying <button>", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Hola</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges caller-provided className with variant classes without duplicates", () => {
    render(
      <Button size="md" className="text-3xl">
        Cargar
      </Button>,
    );
    // twMerge should drop the variant text-lg in favour of the caller's text-3xl.
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("text-3xl");
    expect(cls).not.toContain("text-lg");
  });
});
