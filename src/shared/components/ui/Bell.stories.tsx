import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";
import { Bell } from "./Bell";

const meta = {
  title: "UI/Bell",
  component: Bell,
  argTypes: {
    state: { control: "select", options: ["default", "open"] },
    count: { control: { type: "number", min: 0, max: 200 } },
  },
} satisfies Meta<typeof Bell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCount: Story = {
  args: { count: 5 },
};

export const HighCount: Story = {
  args: { count: 150 },
};

export const DotOnly: Story = {
  args: { count: 3, dotOnly: true },
};

export const OpenState: Story = {
  args: { count: 3, state: "open" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div className="flex items-center gap-lg">
        <Bell count={count} />
        <Button intent="secondary" size="sm" onClick={() => setCount((c) => c + 1)}>
          +1
        </Button>
        <Button intent="secondary" size="sm" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          -1
        </Button>
        <Button intent="ghost" size="sm" onClick={() => setCount(0)}>
          Reset
        </Button>
      </div>
    );
  },
};
