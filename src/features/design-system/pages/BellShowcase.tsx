import { useEffect, useState } from "react";

import { Bell } from "@/shared/components/ui/Bell";
import { Button } from "@/shared/components/ui/Button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

export function BellShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [liveCount, setLiveCount] = useState(0);

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
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Bell</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              Botón de notificaciones con badge numérico, dot y animación.
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

        <Section title="Estados del botón">
          <div className="flex items-center gap-xl">
            <div className="flex flex-col items-center gap-sm">
              <Bell />
              <span className="text-2xs text-text-tertiary">Default</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={3} />
              <span className="text-2xs text-text-tertiary">Con badge</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell state="open" count={3} />
              <span className="text-2xs text-text-tertiary">Open</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell disabled />
              <span className="text-2xs text-text-tertiary">Disabled</span>
            </div>
          </div>
        </Section>

        <Section title="Conteos">
          <div className="flex items-center gap-xl">
            <div className="flex flex-col items-center gap-sm">
              <Bell count={0} />
              <span className="text-2xs text-text-tertiary">0 (sin badge)</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={1} />
              <span className="text-2xs text-text-tertiary">1</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={9} />
              <span className="text-2xs text-text-tertiary">9</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={42} />
              <span className="text-2xs text-text-tertiary">42</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={99} />
              <span className="text-2xs text-text-tertiary">99</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={150} />
              <span className="text-2xs text-text-tertiary">150 (99+)</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={1500} />
              <span className="text-2xs text-text-tertiary">1500 (99+)</span>
            </div>
          </div>
        </Section>

        <Section title="Dot only">
          <div className="flex items-center gap-xl">
            <div className="flex flex-col items-center gap-sm">
              <Bell count={5} dotOnly />
              <span className="text-2xs text-text-tertiary">Dot (sin número)</span>
            </div>
            <div className="flex flex-col items-center gap-sm">
              <Bell count={0} dotOnly />
              <span className="text-2xs text-text-tertiary">Dot count=0 (oculto)</span>
            </div>
          </div>
        </Section>

        <Section title="Animación en vivo">
          <div className="flex items-center gap-lg">
            <Bell count={liveCount} />
            <div className="flex gap-sm">
              <Button intent="secondary" size="sm" onClick={() => setLiveCount((c) => c + 1)}>
                +1
              </Button>
              <Button intent="secondary" size="sm" onClick={() => setLiveCount((c) => Math.max(0, c - 1))}>
                -1
              </Button>
              <Button intent="ghost" size="sm" onClick={() => setLiveCount(0)}>
                Reset
              </Button>
            </div>
            <span className="text-sm text-text-tertiary">Cuenta: {liveCount}</span>
          </div>
        </Section>

        <Section title="Sobre fondos distintos">
          <div className="flex gap-lg">
            <div className="flex flex-col items-center gap-sm rounded-lg bg-surface-card p-lg">
              <Bell count={3} />
              <span className="text-2xs text-text-tertiary">surface-card</span>
            </div>
            <div className="flex flex-col items-center gap-sm rounded-lg bg-surface-bg p-lg">
              <Bell count={12} />
              <span className="text-2xs text-text-tertiary">surface-bg</span>
            </div>
            <div className="flex flex-col items-center gap-sm rounded-lg bg-surface-hover p-lg">
              <Bell count={99} />
              <span className="text-2xs text-text-tertiary">surface-hover</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
