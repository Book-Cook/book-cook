import { Add24Regular, Delete24Regular, Edit24Regular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Basic variants */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Basic Variants</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Button appearance="primary">Primary</Button>
          <Button appearance="secondary">Secondary</Button>
          <Button appearance="subtle">Subtle</Button>
          <Button appearance="transparent">Transparent</Button>
        </div>
      </div>

      {/* With icons */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>With Icons</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Button appearance="primary" icon={<Add24Regular />}>Add Item</Button>
          <Button appearance="secondary" icon={<Edit24Regular />}>Edit</Button>
          <Button appearance="subtle" icon={<Delete24Regular />}>Delete</Button>
          <Button appearance="transparent" icon={<Add24Regular />}>Create</Button>
        </div>
      </div>

      {/* Icon only */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Icon Only</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Button appearance="primary" icon={<Add24Regular />} />
          <Button appearance="secondary" icon={<Edit24Regular />} />
          <Button appearance="subtle" icon={<Delete24Regular />} />
          <Button appearance="transparent" icon={<Add24Regular />} />
        </div>
      </div>

      {/* Disabled states */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Disabled States</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Button appearance="primary" disabled>Primary</Button>
          <Button appearance="secondary" disabled>Secondary</Button>
          <Button appearance="subtle" disabled>Subtle</Button>
          <Button appearance="transparent" disabled>Transparent</Button>
        </div>
      </div>

      {/* Disabled with icons */}
      <div>
        <h3 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Disabled with Icons</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <Button appearance="primary" icon={<Add24Regular />} disabled>Add Item</Button>
          <Button appearance="secondary" icon={<Edit24Regular />} disabled>Edit</Button>
          <Button appearance="subtle" icon={<Delete24Regular />} disabled />
        </div>
      </div>
    </div>
  ),
};
