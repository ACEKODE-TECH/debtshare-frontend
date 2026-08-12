import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    variant: { control: "select", options: ["text", "numeric", "search", "textarea"] },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { variant: "text", label: "Nombre del gasto", placeholder: "Ej: Cena en Salamanca" },
};

export const WithError: Story = {
  args: {
    variant: "text",
    label: "Email",
    placeholder: "tu@email.com",
    error: "El email no es válido",
    defaultValue: "usuario@",
  },
};

export const WithHelpText: Story = {
  args: {
    variant: "text",
    label: "Nombre del grupo",
    placeholder: "Ej: Viaje a Lisboa",
    helpText: "Máximo 40 caracteres",
  },
};

export const Numeric: Story = {
  args: { variant: "numeric", label: "Importe", placeholder: "0,00", currencySymbol: "€" },
};

export const Search: Story = {
  args: { variant: "search", placeholder: "Buscar gastos…" },
};

export const Textarea: Story = {
  args: { variant: "textarea", label: "Notas", placeholder: "Añade detalles sobre este gasto…" },
};

export const Disabled: Story = {
  args: { variant: "text", label: "Campo deshabilitado", value: "No editable", disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[340px] flex-col gap-xl">
      <Input variant="text" label="Texto" placeholder="Escribe algo…" />
      <Input variant="numeric" label="Importe" placeholder="0,00" currencySymbol="€" />
      <Input variant="search" placeholder="Buscar gastos…" />
      <Input variant="textarea" label="Notas" placeholder="Añade detalles…" />
    </div>
  ),
};
