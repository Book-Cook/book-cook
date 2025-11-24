import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "../../components/Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Gallery: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Link href="/recipes">Internal link (default)</Link>
      <Link href="/recipes" underline="always">
        Always underlined
      </Link>
      <Link href="/recipes" underline="none">
        No underline
      </Link>
      <Link href="https://example.com" target="_blank">
        External link (_blank)
      </Link>
      <Link href="/about" tone="muted">
        Muted tone
      </Link>
    </div>
  ),
};
