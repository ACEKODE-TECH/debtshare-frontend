import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./EmptyState";

const TestIcon = () => <svg data-testid="test-icon" />;

describe("EmptyState", () => {
  it("renders title, description and icon", () => {
    render(<EmptyState icon={<TestIcon />} title="Sin gastos" description="Añade tu primer gasto" />);
    expect(screen.getByText("Sin gastos")).toBeInTheDocument();
    expect(screen.getByText("Añade tu primer gasto")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders primary action when provided", () => {
    render(
      <EmptyState
        icon={<TestIcon />}
        title="Sin gastos"
        description="Añade tu primer gasto"
        action={<button>Crear gasto</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Crear gasto" })).toBeInTheDocument();
  });

  it("renders secondary action when provided", () => {
    render(
      <EmptyState
        icon={<TestIcon />}
        title="Sin gastos"
        description="Añade tu primer gasto"
        secondaryAction={<button>Importar datos</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Importar datos" })).toBeInTheDocument();
  });

  it("does not render action containers when no actions provided", () => {
    const { container } = render(
      <EmptyState icon={<TestIcon />} title="Sin gastos" description="Añade tu primer gasto" />,
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(0);
  });

  it("applies neutral variant styles by default", () => {
    const { container } = render(
      <EmptyState icon={<TestIcon />} title="Sin gastos" description="Añade tu primer gasto" />,
    );
    const iconContainer = container.querySelector(".bg-surface-hover");
    expect(iconContainer).toBeInTheDocument();
  });

  it("applies success variant styles", () => {
    const { container } = render(
      <EmptyState
        variant="success"
        icon={<TestIcon />}
        title="Todo saldado"
        description="No hay deudas pendientes"
      />,
    );
    const iconContainer = container.querySelector(".bg-feedback-success-subtle");
    expect(iconContainer).toBeInTheDocument();
  });

  it("applies error variant styles", () => {
    const { container } = render(
      <EmptyState variant="error" icon={<TestIcon />} title="Error al cargar" description="Algo salió mal" />,
    );
    const iconContainer = container.querySelector(".bg-feedback-danger-subtle");
    expect(iconContainer).toBeInTheDocument();
  });

  it("applies search variant styles", () => {
    const { container } = render(
      <EmptyState
        variant="search"
        icon={<TestIcon />}
        title="Sin resultados"
        description='No hay resultados para "pizza"'
      />,
    );
    const iconContainer = container.querySelector(".bg-brand-subtle");
    expect(iconContainer).toBeInTheDocument();
  });

  it("passes custom className to the container", () => {
    const { container } = render(
      <EmptyState
        icon={<TestIcon />}
        title="Sin gastos"
        description="Añade tu primer gasto"
        className="custom-class"
      />,
    );
    expect(container.firstElementChild?.className).toContain("custom-class");
  });

  it("renders both actions together", () => {
    render(
      <EmptyState
        variant="error"
        icon={<TestIcon />}
        title="Error al cargar"
        description="No se pudieron cargar los datos"
        action={<button>Reintentar</button>}
        secondaryAction={<button>Volver</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Volver" })).toBeInTheDocument();
  });

  it("renders description with search term in quotes", () => {
    render(
      <EmptyState
        variant="search"
        icon={<TestIcon />}
        title="Sin resultados"
        description='No encontramos gastos con "hotel barcelona"'
      />,
    );
    expect(screen.getByText('No encontramos gastos con "hotel barcelona"')).toBeInTheDocument();
  });
});
