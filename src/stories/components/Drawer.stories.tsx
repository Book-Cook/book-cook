import * as React from "react";
import { Dismiss24Regular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../components/Button";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
} from "../../components/Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Drawer>;

const DrawerPreview: React.FC<{
  position?: "start" | "end";
  label: string;
}> = ({ position = "end", label }) => {
  const [open, setOpen] = React.useState(false);
  const titleId = `${position}-drawer-title`;

  return (
    <div style={{ minHeight: "360px", padding: "16px" }}>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open {label}
      </Button>

      <Drawer
        open={open}
        position={position}
        ariaLabelledBy={titleId}
        onOpenChange={(_, data) => setOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            id={titleId}
            action={
              <Button
                appearance="subtle"
                aria-label="Close drawer"
                icon={<Dismiss24Regular />}
                onClick={() => setOpen(false)}
              />
            }
          >
            {label}
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <p style={{ marginTop: 0, color: "var(--colorNeutralForeground2)" }}>
            Use the Drawer component to present focused tasks or navigation on
            mobile. It is powered by the native popover API and stays consistent
            with the app theme.
          </p>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              color: "var(--colorNeutralForeground1)",
            }}
          >
            <li>Supports start or end positioning</li>
            <li>Backdrop click and Escape to close</li>
            <li>Composable header and body slots</li>
          </ul>
        </DrawerBody>
      </Drawer>
    </div>
  );
};

export const Start: Story = {
  render: () => <DrawerPreview position="start" label="Navigation" />,
};

export const End: Story = {
  render: () => <DrawerPreview position="end" label="Details" />,
};
