import type { Meta, StoryObj } from "@storybook/nextjs";

import { RecipePage } from "../components/RecipePage";

const meta: Meta<typeof RecipePage> = {
  title: "Pages/RecipePage",
  component: RecipePage,
};

export default meta;

export const Default: StoryObj<typeof RecipePage> = {};
