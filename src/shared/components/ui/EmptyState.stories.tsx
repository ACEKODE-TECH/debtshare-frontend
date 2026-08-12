import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { AllSettled, NoExpenses, NoGroups, NoReceipts } from "../illustrations";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  argTypes: {
    variant: { control: "select", options: ["neutral", "success", "error", "search"] },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: {
    variant: "neutral",
    icon: <NoExpenses />,
    title: "Sin gastos todavía",
    description: "Añade el primer gasto del grupo para empezar a repartir cuentas.",
    action: <Button intent="primary">Añadir gasto</Button>,
  },
};

export const Search: Story = {
  args: {
    variant: "search",
    icon: <NoReceipts />,
    title: "Sin resultados",
    description: "No hemos encontrado gastos que coincidan con tu búsqueda.",
    action: <Button intent="secondary">Limpiar filtros</Button>,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    icon: <NoExpenses />,
    title: "Error al cargar",
    description: "No se pudieron cargar los gastos. Revisa tu conexión e inténtalo de nuevo.",
    action: <Button intent="primary">Reintentar</Button>,
    secondaryAction: (
      <button className="text-md font-medium text-text-tertiary hover:text-text-secondary">
        Contactar soporte
      </button>
    ),
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    icon: <AllSettled />,
    title: "¡Todo saldado!",
    description: "No quedan deudas pendientes en este grupo. Buen trabajo.",
  },
};

export const NoGroupsState: Story = {
  args: {
    variant: "neutral",
    icon: <NoGroups />,
    title: "Sin grupos",
    description: "Crea tu primer grupo para empezar a compartir gastos con amigos.",
    action: <Button intent="primary">Crear grupo</Button>,
  },
};

export const AllVariants: StoryFn = () => (
  <div className="flex flex-col gap-4xl">
    <EmptyState
      variant="neutral"
      icon={<NoExpenses />}
      title="Sin gastos todavía"
      description="Añade el primer gasto del grupo para empezar a repartir cuentas."
      action={<Button intent="primary">Añadir gasto</Button>}
    />
    <EmptyState
      variant="neutral"
      icon={<NoGroups />}
      title="Sin grupos"
      description="Crea tu primer grupo para empezar a compartir gastos con amigos."
      action={<Button intent="primary">Crear grupo</Button>}
    />
    <EmptyState
      variant="search"
      icon={<NoReceipts />}
      title="Sin resultados"
      description="No hemos encontrado gastos que coincidan con tu búsqueda."
    />
    <EmptyState
      variant="error"
      icon={<NoExpenses />}
      title="Error al cargar"
      description="No se pudieron cargar los gastos. Revisa tu conexión e inténtalo de nuevo."
      action={<Button intent="primary">Reintentar</Button>}
    />
    <EmptyState
      variant="success"
      icon={<AllSettled />}
      title="¡Todo saldado!"
      description="No quedan deudas pendientes en este grupo."
    />
  </div>
);
