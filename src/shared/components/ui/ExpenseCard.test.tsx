import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExpenseCard } from "./ExpenseCard";

const BASE_PROPS = {
  title: "Cena en La Barraca",
  subtitle: "Pagó María · hace 2h",
  amount: 84.5,
  delta: -21.13,
  category: "food" as const,
};

describe("ExpenseCard", () => {
  it("renders title, subtitle, amount and delta", () => {
    render(<ExpenseCard {...BASE_PROPS} />);
    expect(screen.getByText("Cena en La Barraca")).toBeInTheDocument();
    expect(screen.getByText("Pagó María · hace 2h")).toBeInTheDocument();
    expect(screen.getByText("84,50 €")).toBeInTheDocument();
    expect(screen.getByText("−21,13 €")).toBeInTheDocument();
  });

  it("uses role=article for semantic grouping", () => {
    render(<ExpenseCard {...BASE_PROPS} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("formats large amounts with comma decimals (es-ES locale)", () => {
    render(<ExpenseCard {...BASE_PROPS} amount={1284.5} delta={642.25} />);
    const amountEl = screen.getByText(
      (_, el) => el?.tagName === "SPAN" && !!el.textContent?.match(/1\.?284,50/),
    );
    expect(amountEl).toBeInTheDocument();
    expect(screen.getByText("+642,25 €")).toBeInTheDocument();
  });

  it("shows + prefix for positive deltas and − (U+2212) for negative", () => {
    const { rerender } = render(<ExpenseCard {...BASE_PROPS} delta={16} />);
    expect(screen.getByText("+16,00 €")).toBeInTheDocument();

    rerender(<ExpenseCard {...BASE_PROPS} delta={-4.32} />);
    expect(screen.getByText("−4,32 €")).toBeInTheDocument();
  });

  it('shows "Sin impacto" when delta is exactly zero', () => {
    render(<ExpenseCard {...BASE_PROPS} delta={0} />);
    expect(screen.getByText("Sin impacto")).toBeInTheDocument();
  });

  it("applies success color for positive delta and danger for negative", () => {
    const { rerender } = render(<ExpenseCard {...BASE_PROPS} delta={10} />);
    const deltaEl = screen.getByText("+10,00 €");
    expect(deltaEl.className).toContain("text-feedback-success");

    rerender(<ExpenseCard {...BASE_PROPS} delta={-5} />);
    const negDelta = screen.getByText("−5,00 €");
    expect(negDelta.className).toContain("text-feedback-danger");
  });

  it("applies tertiary color for zero-delta text", () => {
    render(<ExpenseCard {...BASE_PROPS} delta={0} />);
    expect(screen.getByText("Sin impacto").className).toContain("text-text-tertiary");
  });

  describe("variants", () => {
    it("default variant applies bg-surface-card and min-h-[76px]", () => {
      render(<ExpenseCard {...BASE_PROPS} />);
      const card = screen.getByRole("article");
      expect(card.className).toContain("bg-surface-card");
      expect(card.className).toContain("min-h-[76px]");
    });

    it("compact variant reduces padding and icon size", () => {
      render(<ExpenseCard {...BASE_PROPS} variant="compact" />);
      const card = screen.getByRole("article");
      expect(card.className).toContain("py-sm-plus");
      expect(card.className).toContain("px-md-plus");
    });

    it("settled variant mutes title and subtitle", () => {
      render(<ExpenseCard {...BASE_PROPS} variant="settled" />);
      const title = screen.getByText("Cena en La Barraca");
      expect(title.className).toContain("text-text-muted");
    });
  });

  describe("settled state", () => {
    it('shows "Saldado" instead of the numeric delta', () => {
      render(<ExpenseCard {...BASE_PROPS} settled />);
      expect(screen.getByText("Saldado")).toBeInTheDocument();
      expect(screen.queryByText("−21,13 €")).not.toBeInTheDocument();
    });

    it("applies grayscale + reduced opacity to the category icon", () => {
      render(<ExpenseCard {...BASE_PROPS} settled />);
      const card = screen.getByRole("article");
      const icon = card.querySelector("div > div:first-child");
      expect(icon?.className).toContain("opacity-60");
      expect(icon?.className).toContain("grayscale");
    });

    it("can be activated via settled prop on any variant", () => {
      render(<ExpenseCard {...BASE_PROPS} variant="compact" settled />);
      expect(screen.getByText("Saldado")).toBeInTheDocument();
    });
  });

  describe("categories", () => {
    it("applies category-specific background and foreground colors", () => {
      render(<ExpenseCard {...BASE_PROPS} category="food" />);
      const card = screen.getByRole("article");
      const icon = card.querySelector("div > div:first-child");
      expect(icon?.className).toContain("bg-category-food-bg");
      expect(icon?.className).toContain("text-category-food-fg");
    });

    it("renders distinct colors per category", () => {
      const categories = ["transport", "lodging", "leisure", "shopping", "other"] as const;
      for (const cat of categories) {
        const { unmount } = render(<ExpenseCard {...BASE_PROPS} category={cat} />);
        const card = screen.getByRole("article");
        const icon = card.querySelector("div > div:first-child");
        expect(icon?.className).toContain(`bg-category-${cat}-bg`);
        expect(icon?.className).toContain(`text-category-${cat}-fg`);
        unmount();
      }
    });
  });

  it("accepts a custom categoryIcon", () => {
    render(<ExpenseCard {...BASE_PROPS} categoryIcon={<span data-testid="custom-icon">🍕</span>} />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("supports a custom currency and locale", () => {
    render(<ExpenseCard {...BASE_PROPS} amount={100} delta={50} currency="USD" locale="en-US" />);
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("+$50.00")).toBeInTheDocument();
  });

  it("forwards refs to the root div", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ExpenseCard ref={ref} {...BASE_PROPS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges caller className with variant classes", () => {
    render(<ExpenseCard {...BASE_PROPS} className="my-custom-class" />);
    const card = screen.getByRole("article");
    expect(card.className).toContain("my-custom-class");
    expect(card.className).toContain("bg-surface-card");
  });
});
