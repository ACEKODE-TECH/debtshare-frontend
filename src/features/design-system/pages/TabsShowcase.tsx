import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Tabs } from "@/shared/components/ui/Tabs";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function TabsShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [underline, setUnderline] = useState("gastos");
  const [pill, setPill] = useState("todos");
  const [segmented, setSegmented] = useState("7d");
  const [withCount, setWithCount] = useState("pendientes");
  const [disabled, setDisabled] = useState("activos");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-surface-bg px-2xl py-3xl">
      <div className="mx-auto flex max-w-2xl flex-col gap-3xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="mb-xs text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Design system
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Tabs</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              3 variantes: underline, pill, segmented. Navegación por teclado, contadores opcionales.
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

        <Section title="Underline (default)">
          <Tabs
            variant="underline"
            items={[
              { value: "gastos", label: "Gastos" },
              { value: "balances", label: "Balances" },
              { value: "actividad", label: "Actividad" },
            ]}
            value={underline}
            onValueChange={setUnderline}
          />
          <p className="mt-lg text-md text-text-secondary">
            Tab activo: <strong className="text-text-primary">{underline}</strong>
          </p>
        </Section>

        <Section title="Pill (filtros)">
          <Tabs
            variant="pill"
            items={[
              { value: "todos", label: "Todos" },
              { value: "pendientes", label: "Pendientes" },
              { value: "saldados", label: "Saldados" },
            ]}
            value={pill}
            onValueChange={setPill}
          />
          <p className="mt-lg text-md text-text-secondary">
            Filtro: <strong className="text-text-primary">{pill}</strong>
          </p>
        </Section>

        <Section title="Segmented (periodo)">
          <Tabs
            variant="segmented"
            items={[
              { value: "7d", label: "7 días" },
              { value: "30d", label: "30 días" },
              { value: "90d", label: "90 días" },
            ]}
            value={segmented}
            onValueChange={setSegmented}
          />
          <p className="mt-lg text-md text-text-secondary">
            Periodo: <strong className="text-text-primary">{segmented}</strong>
          </p>
        </Section>

        <Section title="Con contadores">
          <Tabs
            variant="pill"
            items={[
              { value: "pendientes", label: "Pendientes", count: 5 },
              { value: "saldados", label: "Saldados", count: 12 },
              { value: "todos", label: "Todos", count: 17 },
            ]}
            value={withCount}
            onValueChange={setWithCount}
          />
        </Section>

        <Section title="Con tab deshabilitado">
          <Tabs
            variant="underline"
            items={[
              { value: "activos", label: "Activos" },
              { value: "archivados", label: "Archivados", disabled: true },
              { value: "eliminados", label: "Eliminados" },
            ]}
            value={disabled}
            onValueChange={setDisabled}
          />
          <p className="mt-lg text-md text-text-tertiary">
            «Archivados» está deshabilitado (opacity 0.4, sin interacción).
          </p>
        </Section>
      </div>
    </div>
  );
}
