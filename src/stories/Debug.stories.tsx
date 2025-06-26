import type { Meta, StoryObj } from "@storybook/nextjs";

// Minimal component with no Fluent UI to test if that's the issue
const DebugComponent = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Component - No Fluent UI</h1>
      <p>Testing DOM Issues</p>
    </div>
  );
};

const meta: Meta<typeof DebugComponent> = {
  title: "Debug/Simple",
  component: DebugComponent,
  parameters: {
    layout: 'centered',
  },
  decorators: [], // No decorators to bypass all providers
};

export default meta;

type Story = StoryObj<typeof DebugComponent>;

export const Simple: Story = {
  decorators: [], // Ensure no providers are used
};