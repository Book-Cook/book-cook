import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  args: {
    label: "Loading...",
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, alignItems: "center" }}>
      <Spinner size="tiny" label="Tiny" />
      <Spinner size="small" label="Small" />
      <Spinner size="medium" label="Medium" />
      <Spinner size="large" label="Large" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined },
};
