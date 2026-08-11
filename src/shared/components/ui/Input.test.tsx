import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input placeholder="Descripción del gasto" />);
    expect(screen.getByPlaceholderText("Descripción del gasto")).toBeInTheDocument();
  });

  it("renders a label linked via htmlFor", () => {
    render(<Input label="Nombre" id="name" />);
    const label = screen.getByText("Nombre");
    expect(label).toHaveAttribute("for", "name");
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "name");
  });

  it("auto-generates an id and links label when no id is provided", () => {
    render(<Input label="Email" />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Email");
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
  });

  it("shows help text", () => {
    render(<Input helpText="Máximo 200 caracteres" />);
    expect(screen.getByText("Máximo 200 caracteres")).toBeInTheDocument();
  });

  it("shows error text and sets aria-invalid", () => {
    render(<Input error="Este campo es obligatorio" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const msg = screen.getByText("Este campo es obligatorio");
    expect(msg).toBeInTheDocument();
    expect(msg.className).toContain("text-feedback-danger");
  });

  it("error takes priority over help text", () => {
    render(<Input helpText="Ayuda" error="Error" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.queryByText("Ayuda")).not.toBeInTheDocument();
  });

  it("applies disabled styling", () => {
    render(<Input disabled label="Disabled" />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("applies readonly styling", () => {
    render(<Input readOnly label="Readonly" defaultValue="Fijo" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("readonly");
  });

  describe("variant=textarea", () => {
    it("renders a textarea element", () => {
      render(<Input variant="textarea" placeholder="Notas" />);
      const ta = screen.getByPlaceholderText("Notas");
      expect(ta.tagName).toBe("TEXTAREA");
      expect(ta).toHaveAttribute("rows", "3");
    });
  });

  describe("variant=numeric", () => {
    it("sets inputMode to decimal", () => {
      render(<Input variant="numeric" placeholder="0.00" />);
      expect(screen.getByPlaceholderText("0.00")).toHaveAttribute("inputMode", "decimal");
    });

    it("renders a currency prefix when provided", () => {
      render(<Input variant="numeric" currencySymbol="€" />);
      expect(screen.getByText("€")).toBeInTheDocument();
    });

    it("blocks non-numeric keys", async () => {
      const user = userEvent.setup();
      render(<Input variant="numeric" />);
      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.keyboard("abc123.,xyz");
      expect(input).toHaveValue("123.,");
    });
  });

  describe("variant=search", () => {
    it("renders a search icon", () => {
      render(<Input variant="search" placeholder="Buscar gastos" />);
      expect(screen.getByPlaceholderText("Buscar gastos")).toBeInTheDocument();
    });

    it("shows clear button only when value is non-empty", () => {
      const { rerender } = render(<Input variant="search" value="" onChange={() => {}} />);
      expect(screen.queryByLabelText("Limpiar búsqueda")).not.toBeInTheDocument();

      rerender(<Input variant="search" value="café" onChange={() => {}} />);
      expect(screen.getByLabelText("Limpiar búsqueda")).toBeInTheDocument();
    });

    it("calls onClear when clear button is clicked", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(<Input variant="search" value="test" onChange={() => {}} onClear={onClear} />);
      await user.click(screen.getByLabelText("Limpiar búsqueda"));
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  it("forwards refs to the underlying element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards refs for textarea variant", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Input variant="textarea" ref={ref as React.Ref<HTMLInputElement | HTMLTextAreaElement>} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("links aria-describedby to the help/error message", () => {
    render(<Input id="amount" helpText="Incluye IVA" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "amount-help");
    expect(screen.getByText("Incluye IVA")).toHaveAttribute("id", "amount-help");
  });
});
