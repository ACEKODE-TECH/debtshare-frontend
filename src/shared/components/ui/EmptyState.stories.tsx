import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

const PlaceholderIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4Zm0 22c-5.523 0-10-4.477-10-10S10.477 6 16 6s10 4.477 10 10-4.477 10-10 10Zm1-13h-2v4h-4v2h4v4h2v-4h4v-2h-4v-4Z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.414 24.586l-5.077-5.077A9.932 9.932 0 0 0 24 14c0-5.523-4.477-10-10-10S4 8.477 4 14s4.477 10 10 10a9.932 5.509 0 0 0 5.509-1.663l5.077 5.077 2.828-2.828ZM6 14c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8-8-3.589-8-8Z"
      fill="currentColor"
    />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 4H8a2 2 0 0 0-2 2v22l4-2 4 2 4-2 4 2V6a2 2 0 0 0-2-2Zm0 21.764-2-1-4 2-4-2-4 2V6h16v19.764ZM10 10h12v2H10v-2Zm0 4h12v2H10v-2Zm0 4h8v2h-8v-2Z"
      fill="currentColor"
    />
  </svg>
);

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
    icon: <PlaceholderIcon />,
    title: "Sin gastos todavía",
    description: "Añade el primer gasto del grupo para empezar a repartir cuentas.",
    action: <Button intent="primary">Añadir gasto</Button>,
  },
};

export const Search: Story = {
  args: {
    variant: "search",
    icon: <SearchIcon />,
    title: "Sin resultados",
    description: "No hemos encontrado gastos que coincidan con tu búsqueda.",
    action: <Button intent="secondary">Limpiar filtros</Button>,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    icon: <ReceiptIcon />,
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
    icon: <PlaceholderIcon />,
    title: "¡Todo saldado!",
    description: "No quedan deudas pendientes en este grupo. Buen trabajo.",
  },
};

export const AllVariants: StoryFn = () => (
  <div className="flex flex-col gap-4xl">
    <EmptyState
      variant="neutral"
      icon={<PlaceholderIcon />}
      title="Sin gastos todavía"
      description="Añade el primer gasto del grupo para empezar a repartir cuentas."
      action={<Button intent="primary">Añadir gasto</Button>}
    />
    <EmptyState
      variant="search"
      icon={<SearchIcon />}
      title="Sin resultados"
      description="No hemos encontrado gastos que coincidan con tu búsqueda."
    />
    <EmptyState
      variant="error"
      icon={<ReceiptIcon />}
      title="Error al cargar"
      description="No se pudieron cargar los gastos. Revisa tu conexión e inténtalo de nuevo."
      action={<Button intent="primary">Reintentar</Button>}
    />
    <EmptyState
      variant="success"
      icon={<PlaceholderIcon />}
      title="¡Todo saldado!"
      description="No quedan deudas pendientes en este grupo."
    />
  </div>
);
