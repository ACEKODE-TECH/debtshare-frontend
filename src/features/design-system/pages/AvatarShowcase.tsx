import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { Avatar, AvatarGroup } from "@/shared/components/ui/Avatar";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

const PEOPLE = [
  { name: "María García", src: "https://i.pravatar.cc/128?u=maria" },
  { name: "Carlos López", src: "https://i.pravatar.cc/128?u=carlos" },
  { name: "Laura Fernández", src: "https://i.pravatar.cc/128?u=laura" },
  { name: "Álex Ruiz", src: "https://i.pravatar.cc/128?u=alex" },
  { name: "Sofía Martín", src: "https://i.pravatar.cc/128?u=sofia" },
];

export function AvatarShowcase() {
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
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Avatar</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              3 variantes, 5 tamaños, 5 estados, AvatarGroup con overflow.
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

        <Section title="Tamaños (initials)">
          <div className="flex items-end gap-lg">
            <Avatar variant="initials" name="María García" size="xs" />
            <Avatar variant="initials" name="María García" size="sm" />
            <Avatar variant="initials" name="María García" size="md" />
            <Avatar variant="initials" name="María García" size="lg" />
            <Avatar variant="initials" name="María García" size="xl" />
          </div>
          <p className="mt-sm text-md text-text-tertiary">xs (20) · sm (28) · md (36) · lg (48) · xl (64)</p>
        </Section>

        <Section title="Paleta de colores (hash del nombre)">
          <div className="flex flex-wrap items-center gap-sm">
            {[
              "Ana Blanco",
              "Pedro Sanz",
              "Elena Ríos",
              "David Mora",
              "Lucía Vega",
              "Hugo Díaz",
              "Clara Peña",
              "Iván Torres",
            ].map((name) => (
              <div key={name} className="flex flex-col items-center gap-xs">
                <Avatar variant="initials" name={name} size="lg" />
                <span className="text-2xs text-text-tertiary">{name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Placeholder">
          <div className="flex items-end gap-lg">
            <Avatar variant="placeholder" size="sm" />
            <Avatar variant="placeholder" size="md" />
            <Avatar variant="placeholder" size="lg" />
            <Avatar variant="placeholder" size="xl" />
          </div>
        </Section>

        <Section title="Image (con fallback)">
          <div className="flex items-center gap-lg">
            <div className="flex flex-col items-center gap-xs">
              <Avatar src={PEOPLE[0].src} alt={PEOPLE[0].name} size="lg" />
              <span className="text-2xs text-text-tertiary">OK</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Avatar
                src="https://broken.url/404.jpg"
                alt="Foto rota"
                fallbackInitials="Foto Rota"
                size="lg"
              />
              <span className="text-2xs text-text-tertiary">Error → initials</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Avatar src="https://broken.url/404.jpg" alt="Sin fallback" size="lg" />
              <span className="text-2xs text-text-tertiary">Error → placeholder</span>
            </div>
          </div>
        </Section>

        <Section title="Estados">
          <div className="flex items-center gap-xl">
            <div className="flex flex-col items-center gap-xs">
              <Avatar variant="initials" name="Default" size="lg" />
              <span className="text-2xs text-text-tertiary">Default</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Avatar variant="initials" name="Yo Mismo" size="lg" state="current-user" />
              <span className="text-2xs text-text-tertiary">Current user</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Avatar variant="initials" name="Selected" size="lg" state="selected" />
              <span className="text-2xs text-text-tertiary">Selected</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Avatar variant="initials" name="Disabled" size="lg" state="disabled" />
              <span className="text-2xs text-text-tertiary">Disabled</span>
            </div>
            <div className="flex flex-col items-center gap-xs">
              <Avatar variant="placeholder" size="lg" state="loading" />
              <span className="text-2xs text-text-tertiary">Loading</span>
            </div>
          </div>
        </Section>

        <Section title="AvatarGroup">
          <div className="flex flex-col gap-xl">
            <div>
              <p className="mb-sm text-md font-medium text-text-secondary">3 de 5 visibles (default)</p>
              <AvatarGroup size="md">
                {PEOPLE.map((p) => (
                  <Avatar key={p.name} variant="initials" name={p.name} size="md" />
                ))}
              </AvatarGroup>
            </div>
            <div>
              <p className="mb-sm text-md font-medium text-text-secondary">Tamaño lg, max 4</p>
              <AvatarGroup size="lg" max={4}>
                {PEOPLE.map((p) => (
                  <Avatar key={p.name} variant="initials" name={p.name} size="lg" />
                ))}
              </AvatarGroup>
            </div>
            <div>
              <p className="mb-sm text-md font-medium text-text-secondary">Todos visibles (max = total)</p>
              <AvatarGroup size="sm" max={5}>
                {PEOPLE.map((p) => (
                  <Avatar key={p.name} variant="initials" name={p.name} size="sm" />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
