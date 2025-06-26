import type { Meta, StoryObj } from "@storybook/nextjs";
import { Text } from "@fluentui/react-components";

// Simple test component without any complex interactions
const DebugComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Text size={500}>Debug Component - Testing DOM Issues</Text>
    </div>
  );
};

const meta: Meta<typeof DebugComponent> = {
  title: "Debug/Simple",
  component: DebugComponent,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DebugComponent>;

export const Simple: Story = {};