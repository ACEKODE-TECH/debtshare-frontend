import { Link } from "react-router";

const COMPONENTS = [
  { path: "/design-system/avatar", label: "Avatar" },
  { path: "/design-system/badge", label: "Badge" },
  { path: "/design-system/bell", label: "Bell" },
  { path: "/design-system/button", label: "Button" },
  { path: "/design-system/expense-card", label: "ExpenseCard" },
  { path: "/design-system/input", label: "Input" },
  { path: "/design-system/tabs", label: "Tabs" },
];

export function DesignSystemIndex() {
  return (
    <div className="min-h-screen bg-surface-bg px-2xl py-3xl">
      <div className="mx-auto max-w-md">
        <p className="mb-xs text-xs font-bold uppercase tracking-wider text-text-tertiary">Design system</p>
        <h1 className="mb-2xl text-3xl font-extrabold tracking-tight text-text-primary">Componentes</h1>
        <nav>
          <ul className="flex flex-col gap-sm">
            {COMPONENTS.map((c) => (
              <li key={c.path}>
                <Link
                  to={c.path}
                  className="flex items-center justify-between rounded-lg border border-border-default bg-surface-card px-lg py-md text-md font-medium text-text-primary transition-colors hover:border-border-stronger hover:bg-surface-card-alt"
                >
                  {c.label}
                  <span className="text-text-tertiary" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
