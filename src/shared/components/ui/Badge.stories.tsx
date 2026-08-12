import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "success", "warning", "danger", "plum", "solid-danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: { variant: "neutral", children: "5 grupos" },
};

export const Brand: Story = {
  args: { variant: "brand", children: "Premium" },
};

export const Success: Story = {
  args: { variant: "success", children: "Pagado" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Revisión" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Rechazado" },
};

export const SolidDanger: Story = {
  args: { variant: "solid-danger", children: "3 sin pagar" },
};

export const WithDot: Story = {
  args: { variant: "success", dot: true, children: "Conectado" },
};

export const Uppercase: Story = {
  args: { variant: "success", uppercase: true, children: "Saldado" },
};

export const AllVariants: StoryFn = () => (
  <div className="flex flex-wrap items-center gap-sm">
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="brand">Brand</Badge>
    <Badge variant="success">Aprobado</Badge>
    <Badge variant="warning">Revisión</Badge>
    <Badge variant="danger">Rechazado</Badge>
    <Badge variant="plum">Premium</Badge>
    <Badge variant="solid-danger">3 sin pagar</Badge>
  </div>
);

export const AllSizes: StoryFn = () => (
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
);
