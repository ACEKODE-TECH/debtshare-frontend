import { useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/Button";
import { ExpenseCard, type ExpenseCategory } from "@/shared/components/ui/ExpenseCard";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-default pt-2xl">
      <h2 className="mb-lg text-xl font-bold text-text-primary">{title}</h2>
      {children}
    </section>
  );
}

const SAMPLE_EXPENSES: {
  title: string;
  subtitle: string;
  amount: number;
  delta: number;
  category: ExpenseCategory;
}[] = [
  {
    title: "Cena en La Barraca",
    subtitle: "Pagó María · hace 2h",
    amount: 84.5,
    delta: -21.13,
    category: "food",
  },
  {
    title: "Uber al aeropuerto",
    subtitle: "Pagó Carlos · ayer",
    amount: 32.0,
    delta: 16.0,
    category: "transport",
  },
  {
    title: "Airbnb Mallorca — 3 noches",
    subtitle: "Pagó Laura · hace 3 días",
    amount: 456.0,
    delta: -114.0,
    category: "lodging",
  },
  {
    title: "Entradas Museo Dalí",
    subtitle: "Pagó Álex · hace 5 días",
    amount: 48.0,
    delta: 0,
    category: "leisure",
  },
  {
    title: "Supermercado Mercadona",
    subtitle: "Pagó María · hace 1 semana",
    amount: 67.32,
    delta: 22.44,
    category: "shopping",
  },
  {
    title: "Farmacia — protector solar",
    subtitle: "Pagó Carlos · hace 1 semana",
    amount: 12.95,
    delta: -4.32,
    category: "other",
  },
];

export function ExpenseCardShowcase() {
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
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">ExpenseCard</h1>
            <p className="mt-sm max-w-xl text-lg text-text-secondary">
              3 variantes × 5 estados, 6 categorías con icono y tint.
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

        <Section title="Default">
          <div className="flex flex-col gap-sm">
            {SAMPLE_EXPENSES.map((expense) => (
              <ExpenseCard key={expense.title} {...expense} />
            ))}
          </div>
        </Section>

        <Section title="Compact">
          <div className="flex flex-col gap-xs">
            {SAMPLE_EXPENSES.slice(0, 3).map((expense) => (
              <ExpenseCard key={expense.title} variant="compact" {...expense} />
            ))}
          </div>
        </Section>

        <Section title="Settled (saldado)">
          <div className="flex flex-col gap-sm">
            <ExpenseCard
              title="Cena en La Barraca"
              subtitle="Pagó María · hace 2 semanas"
              amount={84.5}
              delta={-21.13}
              category="food"
              settled
            />
            <ExpenseCard
              title="Uber al aeropuerto"
              subtitle="Pagó Carlos · hace 2 semanas"
              amount={32.0}
              delta={16.0}
              category="transport"
              variant="settled"
            />
          </div>
        </Section>

        <Section title="Delta cero (sin impacto)">
          <ExpenseCard
            title="Entradas Museo Dalí"
            subtitle="Pagó Álex · hace 5 días"
            amount={48.0}
            delta={0}
            category="leisure"
          />
        </Section>

        <Section title="Importes largos">
          <ExpenseCard
            title="Alquiler villa completa para todo el grupo en la costa"
            subtitle="Pagó Laura · hace 10 días"
            amount={2_840.0}
            delta={-710.0}
            category="lodging"
          />
        </Section>
      </div>
    </div>
  );
}
