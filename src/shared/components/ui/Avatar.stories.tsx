import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarGroup } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    state: { control: "select", options: ["default", "current-user", "selected", "disabled", "loading"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: {
    variant: "image",
    src: "https://i.pravatar.cc/128?u=maria",
    alt: "María López",
    size: "lg",
  },
};

export const Initials: Story = {
  args: { variant: "initials", name: "Carlos Ruiz", size: "lg" },
};

export const Placeholder: Story = {
  args: { variant: "placeholder", size: "lg" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Avatar variant="initials" name="Ana García" size="xs" />
      <Avatar variant="initials" name="Ana García" size="sm" />
      <Avatar variant="initials" name="Ana García" size="md" />
      <Avatar variant="initials" name="Ana García" size="lg" />
      <Avatar variant="initials" name="Ana García" size="xl" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Avatar variant="initials" name="Default" size="lg" state="default" />
      <Avatar variant="initials" name="Current User" size="lg" state="current-user" />
      <Avatar variant="initials" name="Selected" size="lg" state="selected" />
      <Avatar variant="initials" name="Disabled" size="lg" state="disabled" />
      <Avatar variant="initials" name="Loading" size="lg" state="loading" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3} size="md">
      <Avatar variant="initials" name="María López" />
      <Avatar variant="initials" name="Carlos Ruiz" />
      <Avatar variant="initials" name="Ana García" />
      <Avatar variant="initials" name="Pedro Sánchez" />
      <Avatar variant="initials" name="Laura Martín" />
    </AvatarGroup>
  ),
};
