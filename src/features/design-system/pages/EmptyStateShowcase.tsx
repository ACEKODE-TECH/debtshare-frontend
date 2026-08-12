import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/ui/EmptyState";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

const ReceiptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M8 4h16a2 2 0 0 1 2 2v22l-3-2-3 2-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 10h8M12 14h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.75" />
    <path
      d="m11 16.5 3.5 3.5L21 13"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AlertIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M16 6 3 26h26L16 6Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M16 14v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="16" cy="22" r="1" fill="currentColor" />
  </svg>
);

const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.75" />
    <path d="m21 21 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export function EmptyStateShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">EmptyState</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              4 variantes para estados sin datos, éxito, error y búsqueda vacía.
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

        <Section title="Neutral — feed vacío">
          <div className="rounded-xl border border-border-default bg-surface-card">
            <EmptyState
              variant="neutral"
              icon={<ReceiptIcon />}
              title="Aún no hay gastos"
              description="Registra el primer gasto del grupo para empezar a dividir cuentas."
              action={<Button intent="primary">Añadir gasto</Button>}
            />
          </div>
        </Section>

        <Section title="Success — todo saldado">
          <div className="rounded-xl border border-border-default bg-surface-card">
            <EmptyState
              variant="success"
              icon={<CheckCircleIcon />}
              title="Todo saldado"
              description="No hay deudas pendientes en este grupo. ¡Buen trabajo!"
            />
          </div>
        </Section>

        <Section title="Error — fallo al cargar">
          <div className="rounded-xl border border-border-default bg-surface-card">
            <EmptyState
              variant="error"
              icon={<AlertIcon />}
              title="No se pudieron cargar los gastos"
              description="Ha ocurrido un problema al conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo."
              action={<Button intent="secondary">Reintentar</Button>}
            />
          </div>
        </Section>

        <Section title="Search — sin resultados">
          <div className="rounded-xl border border-border-default bg-surface-card">
            <EmptyState
              variant="search"
              icon={<SearchIcon />}
              title="Sin resultados"
              description='No encontramos gastos con "hotel barcelona". Prueba con otro término.'
              secondaryAction={
                <Button intent="ghost" size="sm">
                  Limpiar filtros
                </Button>
              }
            />
          </div>
        </Section>

        <Section title="Con ambas acciones">
          <div className="rounded-xl border border-border-default bg-surface-card">
            <EmptyState
              variant="neutral"
              icon={<ReceiptIcon />}
              title="Sin gastos en este grupo"
              description="Empieza añadiendo un gasto o importando desde otra app."
              action={<Button intent="primary">Añadir gasto</Button>}
              secondaryAction={
                <Button intent="ghost" size="sm">
                  Importar desde CSV
                </Button>
              }
            />
          </div>
        </Section>

        <Section title="Solo icono y texto (sin acciones)">
          <div className="rounded-xl border border-border-default bg-surface-card">
            <EmptyState
              variant="neutral"
              icon={<ReceiptIcon />}
              title="No hay actividad reciente"
              description="Los movimientos de tu grupo aparecerán aquí cuando alguien registre un gasto."
            />
          </div>
        </Section>
      </div>
    </div>
  );
}
