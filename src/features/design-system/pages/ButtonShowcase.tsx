import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";

// Portfolio-facing design system reference. Every state that appears in
// docs/design-system-components.md § Button lives here so a review can happen
// against the real DOM instead of a Figma frame.

const INTENTS = ["primary", "secondary", "ghost", "destructive"] as const;
const SIZES = ["sm", "md", "lg"] as const;

function DemoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">{label}</span>
      {children}
    </div>
  );
}

export function ButtonShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-surface-bg px-2xl py-3xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-3xl">
        <header className="flex items-center justify-between">
          <div>
            <p className="mb-xs text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Design system
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Button</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              4 intents × 3 sizes, plus every state described in{" "}
              <code className="font-mono text-md">docs/design-system-components.md</code>.
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

        <Section title="Intents × sizes">
          <div className="grid gap-lg" style={{ gridTemplateColumns: "auto 1fr 1fr 1fr" }}>
            <div />
            {SIZES.map((size) => (
              <span key={size} className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                {size}
              </span>
            ))}
            {INTENTS.map((intent) => (
              <FragmentRow key={intent} intent={intent} />
            ))}
          </div>
        </Section>

        <Section title="Disabled">
          <div className="flex flex-wrap items-center gap-md">
            {INTENTS.map((intent) => (
              <Button key={intent} intent={intent} disabled>
                {intent}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Loading">
          <p className="mb-md max-w-xl text-md text-text-tertiary">
            Spinner sustituye al texto pero el ancho se conserva y el botón deja de ser clickable —{" "}
            <code>aria-busy=true</code>.
          </p>
          <div className="flex flex-wrap items-center gap-md">
            {INTENTS.map((intent) => (
              <Button key={intent} intent={intent} loading>
                {intent === "primary" ? "Guardar gasto" : intent}
              </Button>
            ))}
          </div>
        </Section>

        <Section title="Con iconos">
          <div className="flex flex-wrap items-center gap-md">
            <Button leftIcon={<DemoIcon />}>Añadir gasto</Button>
            <Button intent="secondary" rightIcon={<DemoIcon />}>
              Ver historial
            </Button>
            <Button intent="ghost" leftIcon={<DemoIcon />}>
              Filtrar
            </Button>
          </div>
        </Section>

        <Section title="Icon-only">
          <div className="flex flex-wrap items-center gap-md">
            {SIZES.map((size) => (
              <Cell key={size} label={size}>
                <Button intent="secondary" size={size} iconOnly aria-label={`Añadir gasto (${size})`}>
                  <DemoIcon size={size === "lg" ? 18 : size === "md" ? 16 : 14} />
                </Button>
              </Cell>
            ))}
          </div>
        </Section>

        <Section title="Full width">
          <Button fullWidth intent="primary" size="lg">
            Continuar
          </Button>
        </Section>
      </div>
    </div>
  );
}

function FragmentRow({ intent }: { intent: (typeof INTENTS)[number] }) {
  return (
    <>
      <span className="self-center text-xs font-bold uppercase tracking-wider text-text-tertiary">
        {intent}
      </span>
      {SIZES.map((size) => (
        <div key={size} className="flex items-center">
          <Button intent={intent} size={size}>
            {intent === "primary"
              ? "Guardar"
              : intent === "secondary"
                ? "Cancelar"
                : intent === "ghost"
                  ? "Descartar"
                  : "Eliminar"}
          </Button>
        </div>
      ))}
    </>
  );
}
