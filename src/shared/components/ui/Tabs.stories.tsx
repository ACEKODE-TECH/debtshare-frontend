import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, type TabItem } from "./Tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  argTypes: {
    variant: { control: "select", options: ["underline", "pill", "segmented"] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: TabItem[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "settled", label: "Saldados" },
];

function TabsControlled({
  variant,
  items,
}: {
  variant?: "underline" | "pill" | "segmented";
  items?: TabItem[];
}) {
  const [value, setValue] = useState((items ?? defaultItems)[0].value);
  return <Tabs items={items ?? defaultItems} value={value} onValueChange={setValue} variant={variant} />;
}

export const Underline: Story = {
  render: () => <TabsControlled variant="underline" />,
};

export const Pill: Story = {
  render: () => <TabsControlled variant="pill" />,
};

export const Segmented: Story = {
  render: () => (
    <TabsControlled
      variant="segmented"
      items={[
        { value: "7d", label: "7 días" },
        { value: "30d", label: "30 días" },
        { value: "90d", label: "90 días" },
      ]}
    />
  ),
};

export const WithCounters: Story = {
  render: () => (
    <TabsControlled
      variant="underline"
      items={[
        { value: "all", label: "Todos", count: 24 },
        { value: "pending", label: "Pendientes", count: 8 },
        { value: "settled", label: "Saldados", count: 16 },
      ]}
    />
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <TabsControlled
      variant="pill"
      items={[
        { value: "all", label: "Todos" },
        { value: "pending", label: "Pendientes" },
        { value: "archived", label: "Archivados", disabled: true },
      ]}
    />
  ),
};
