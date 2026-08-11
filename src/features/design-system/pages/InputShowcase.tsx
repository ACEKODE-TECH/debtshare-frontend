import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function InputShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchValue, setSearchValue] = useState("");
  const [numericValue, setNumericValue] = useState("42.50");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-surface-bg px-2xl py-3xl">
      <div className="mx-auto flex max-w-3xl flex-col gap-3xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="mb-xs text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Design system
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Input</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              4 variantes, 7 estados, anatomía label / field / help-error.
            </p>
          </div>
          <Button
            intent="secondary"
            size="sm"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? "Ver en modo oscuro" : "Ver en modo claro"}
          </Button>
        </header>

        <Section title="Text (default)">
          <div className="flex flex-col gap-lg">
            <Input label="Nombre del gasto" placeholder="Ej: Cena en grupo" />
            <Input
              label="Con texto de ayuda"
              placeholder="hotel@booking.com"
              helpText="Email de la reserva para el recibo"
            />
            <Input label="Rellenado" defaultValue="Supermercado Mercadona" />
          </div>
        </Section>

        <Section title="Textarea">
          <Input
            variant="textarea"
            label="Notas"
            placeholder="Detalla qué incluye el gasto, quién participó, etc."
            helpText="Crece automáticamente hasta 6 líneas"
          />
        </Section>

        <Section title="Numeric">
          <div className="grid grid-cols-2 gap-lg">
            <Input
              variant="numeric"
              label="Importe"
              currencySymbol="€"
              value={numericValue}
              onChange={(e) => setNumericValue(e.target.value)}
              placeholder="0.00"
            />
            <Input variant="numeric" label="Sin moneda" placeholder="Cantidad" />
          </div>
        </Section>

        <Section title="Search">
          <Input
            variant="search"
            placeholder="Buscar gastos por nombre o categoría"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
          />
        </Section>

        <Section title="Estados">
          <div className="flex flex-col gap-lg">
            <Input
              label="Error"
              error="Este campo es obligatorio"
              defaultValue=""
              placeholder="Escribe algo"
            />
            <Input label="Disabled" disabled placeholder="No editable" />
            <Input label="Readonly" readOnly defaultValue="Gasto fijo — 120,00 €" />
          </div>
        </Section>

        <Section title="Combinaciones">
          <div className="flex flex-col gap-lg">
            <Input
              variant="numeric"
              label="Importe con error"
              currencySymbol="€"
              error="El importe debe ser mayor que 0"
              defaultValue="0"
            />
            <Input
              variant="textarea"
              label="Textarea disabled"
              disabled
              defaultValue="Contenido fijo que no se puede editar"
            />
            <Input variant="search" label="Búsqueda readonly" readOnly defaultValue="mercadona" />
          </div>
        </Section>
      </div>
    </div>
  );
}
