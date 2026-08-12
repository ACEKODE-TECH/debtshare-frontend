import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { ExpenseCard } from "./ExpenseCard";

const meta = {
  title: "UI/ExpenseCard",
  component: ExpenseCard,
  argTypes: {
    variant: { control: "select", options: ["default", "compact", "settled"] },
    category: {
      control: "select",
      options: ["food", "transport", "lodging", "leisure", "shopping", "other"],
    },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ExpenseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Cena en La Barraca",
    subtitle: "Pagó María · hace 2h",
    amount: 84.5,
    delta: -28.17,
    category: "food",
  },
};

export const Compact: Story = {
  args: {
    title: "Taxi al aeropuerto",
    subtitle: "Pagó Carlos · ayer",
    amount: 32.0,
    delta: 16.0,
    category: "transport",
    variant: "compact",
  },
};

export const Settled: Story = {
  args: {
    title: "Hotel Barceló Raval",
    subtitle: "Pagó Ana · 12 jul",
    amount: 284.5,
    delta: 0,
    category: "lodging",
    variant: "settled",
  },
};

export const PositiveDelta: Story = {
  args: {
    title: "Supermercado Mercadona",
    subtitle: "Pagaste tú · hace 30min",
    amount: 47.83,
    delta: 31.89,
    category: "shopping",
  },
};

export const AllCategories: StoryFn = () => (
  <div className="flex w-[420px] flex-col gap-sm">
    <ExpenseCard
      title="Cena en Roma"
      subtitle="Pagó María · hace 2h"
      amount={84.5}
      delta={-28.17}
      category="food"
    />
    <ExpenseCard
      title="Uber al centro"
      subtitle="Pagó Carlos · ayer"
      amount={18.5}
      delta={9.25}
      category="transport"
    />
    <ExpenseCard
      title="Airbnb Lisboa"
      subtitle="Pagó Ana · 5 jul"
      amount={320}
      delta={-106.67}
      category="lodging"
    />
    <ExpenseCard
      title="Entradas museo"
      subtitle="Pagaste tú · hace 3h"
      amount={45}
      delta={30}
      category="leisure"
    />
    <ExpenseCard
      title="Regalos tienda"
      subtitle="Pagó Pedro · ayer"
      amount={62.9}
      delta={-20.97}
      category="shopping"
    />
    <ExpenseCard title="Propinas" subtitle="Pagó Laura · hace 1h" amount={15} delta={-5} category="other" />
  </div>
);
