import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { intent: "primary", children: "Añadir gasto" },
};

export const Secondary: Story = {
  args: { intent: "secondary", children: "Cancelar" },
};

export const Ghost: Story = {
  args: { intent: "ghost", children: "Ver más" },
};

export const Destructive: Story = {
  args: { intent: "destructive", children: "Eliminar grupo" },
};

export const Loading: Story = {
  args: { intent: "primary", children: "Guardando…", loading: true },
};

export const Disabled: Story = {
  args: { intent: "primary", children: "Enviar", disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Button size="sm">Pequeño</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

export const AllIntents: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Button intent="primary">Primario</Button>
      <Button intent="secondary">Secundario</Button>
      <Button intent="ghost">Ghost</Button>
      <Button intent="destructive">Eliminar</Button>
    </div>
  ),
};
