import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Bell } from "./Bell";

describe("Bell", () => {
  it("renders a bell button with accessible label", () => {
    render(<Bell />);
    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeInTheDocument();
  });

  it("shows no badge when count is 0", () => {
    const { container } = render(<Bell count={0} />);
    expect(container.querySelector("span")).toBeNull();
  });

  it("shows numeric badge for count 1-99", () => {
    render(<Bell count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("caps display at 99+", () => {
    render(<Bell count={150} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("caps large numbers at 99+", () => {
    render(<Bell count={1500} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("updates aria-label with count", () => {
    render(<Bell count={7} />);
    expect(screen.getByRole("button", { name: "Notificaciones (7)" })).toBeInTheDocument();
  });

  it("uses 'más de 99' in aria-label when count > 99", () => {
    render(<Bell count={100} />);
    expect(screen.getByRole("button", { name: "Notificaciones (más de 99)" })).toBeInTheDocument();
  });

  it("renders dot-only badge without text", () => {
    const { container } = render(<Bell count={3} dotOnly />);
    const badge = container.querySelector("span");
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe("");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Bell onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies open state styles", () => {
    render(<Bell state="open" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-brand-subtle");
    expect(button.className).toContain("text-brand-default");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Bell ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it("supports disabled state", () => {
    render(<Bell disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("passes extra className", () => {
    render(<Bell className="custom-class" />);
    expect(screen.getByRole("button").className).toContain("custom-class");
  });
});
