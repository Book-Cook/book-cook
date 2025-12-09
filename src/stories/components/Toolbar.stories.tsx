import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider/next-13.5";
import { SessionProvider } from "next-auth/react";

import { Toolbar } from "../../components/Toolbar";
import { withStoryProviders } from "../decorators/withStoryProviders";

const meta: Meta<typeof Toolbar> = {
  title: "Components/Toolbar",
  component: Toolbar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withStoryProviders()],
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

const ToolbarPreviewLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      background:
        "linear-gradient(135deg, #f5f7fb 0%, #eef2ff 40%, #f8fafc 100%)",
      minHeight: 360,
      paddingBottom: 48,
    }}
  >
    {children}
    <div
      style={{
        padding: "24px 32px",
        maxWidth: 960,
        color: "#4a5568",
        lineHeight: 1.6,
      }}
    >
      <p style={{ marginBottom: 12 }}>
        The toolbar stays anchored to the top of the page and keeps navigation,
        search, and account actions close at hand.
      </p>
      <p style={{ margin: 0 }}>
        Resize the canvas to preview the mobile drawer, or click New Recipe to
        see how the dialog opens without leaving the current view.
      </p>
    </div>
  </div>
);

export const Authenticated: Story = {
  name: "Signed in",
  render: () => (
    <MemoryRouterProvider url="/discover">
      <ToolbarPreviewLayout>
        <Toolbar />
      </ToolbarPreviewLayout>
    </MemoryRouterProvider>
  ),
};

export const SignedOut: Story = {
  name: "Signed out",
  render: () => (
    <SessionProvider session={null}>
      <MemoryRouterProvider url="/discover">
        <ToolbarPreviewLayout>
          <Toolbar />
        </ToolbarPreviewLayout>
      </MemoryRouterProvider>
    </SessionProvider>
  ),
};
