import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SearchBox } from "../../components/SearchBox";

const meta: Meta<typeof SearchBox> = {
  title: "Components/SearchBox",
  component: SearchBox,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof SearchBox>;

const SearchBoxExamples = () => {
  const [value, setValue] = React.useState("");

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 360 }}>
      <SearchBox
        placeholder="Controlled search..."
        value={value}
        onChange={(_e, v) => setValue(v)}
      />
      <SearchBox placeholder="With default value" defaultValue="Pizza" />
      <SearchBox placeholder="Without clear button" allowClear={false} />
      <div style={{ fontSize: 12, color: "#555" }}>
        Current value: <strong>{value}</strong>
      </div>
    </div>
  );
};

export const Examples: Story = {
  render: () => <SearchBoxExamples />,
};
