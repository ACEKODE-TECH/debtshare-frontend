import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function BadgeShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Badge</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              7 variantes, 3 tamaños, dot badge, uppercase opcional.
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

        <Section title="Variantes">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Aprobado</Badge>
            <Badge variant="warning">Revisión</Badge>
            <Badge variant="danger">Rechazado</Badge>
            <Badge variant="plum">Premium</Badge>
            <Badge variant="solid-danger">3 sin pagar</Badge>
          </div>
        </Section>

        <Section title="Tamaños">
          <div className="flex flex-col gap-lg">
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size} className="flex items-center gap-sm">
                <span className="w-[32px] text-2xs font-bold text-text-tertiary">{size}</span>
                <Badge variant="brand" size={size}>
                  5 grupos
                </Badge>
                <Badge variant="success" size={size}>
                  Pagado
                </Badge>
                <Badge variant="danger" size={size}>
                  Pendiente
                </Badge>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Con punto (dot badge)">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge variant="success" dot>
              Conectado
            </Badge>
            <Badge variant="danger" dot>
              Desconectado
            </Badge>
            <Badge variant="warning" dot>
              Ausente
            </Badge>
            <Badge variant="neutral" dot>
              Inactivo
            </Badge>
          </div>
        </Section>

        <Section title="Uppercase (tags de estado)">
          <div className="flex flex-wrap items-center gap-sm">
            <Badge variant="success" uppercase>
              Saldado
            </Badge>
            <Badge variant="warning" uppercase>
              Pendiente
            </Badge>
            <Badge variant="danger" uppercase>
              Vencido
            </Badge>
            <Badge variant="neutral" uppercase>
              Borrador
            </Badge>
          </div>
        </Section>

        <Section title="Uso contextual">
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-sm rounded-lg border border-border-default bg-surface-card px-lg py-md">
              <span className="flex-1 text-md font-medium text-text-primary">Cena en Roma</span>
              <Badge variant="success" size="sm" uppercase>
                Saldado
              </Badge>
            </div>
            <div className="flex items-center gap-sm rounded-lg border border-border-default bg-surface-card px-lg py-md">
              <span className="flex-1 text-md font-medium text-text-primary">Hotel Barcelona</span>
              <Badge variant="warning" size="sm" uppercase>
                Pendiente
              </Badge>
            </div>
            <div className="flex items-center gap-sm rounded-lg border border-border-default bg-surface-card px-lg py-md">
              <span className="flex-1 text-md font-medium text-text-primary">Vuelo Madrid–Berlín</span>
              <Badge variant="solid-danger" size="sm">
                Vence hoy
              </Badge>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
