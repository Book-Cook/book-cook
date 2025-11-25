import type { Meta, StoryObj } from "@storybook/react";

import {
  Body1,
  Body2,
  Caption,
  Heading1,
  Heading2,
  Heading3,
  Subtitle1,
  Subtitle2,
  Text,
} from "../../components/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Gallery: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <Heading1>Heading 1</Heading1>
        <Heading2>Heading 2</Heading2>
        <Heading3>Heading 3</Heading3>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <Subtitle1>Subtitle 1</Subtitle1>
        <Subtitle2>Subtitle 2</Subtitle2>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <Body1>Body 1 text with default weight</Body1>
        <Body2>Body 2 text, smaller</Body2>
        <Caption>Caption text</Caption>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <Text variant="body1" italic>
          Italic body
        </Text>
        <Text variant="body2" truncate style={{ maxWidth: 200, border: "1px dashed #ccc", padding: 4 }}>
          Truncated long line of text that will not wrap when space is limited
        </Text>
        <Text variant="body1" block>
          Block-level text
        </Text>
        <Text variant="body1" weight="bold">
          Custom weight override
        </Text>
      </div>
    </div>
  ),
};
