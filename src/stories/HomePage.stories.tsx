import type { Meta, StoryObj } from "@storybook/nextjs";

import { withMSW } from "./mswDecorator";
import { withMinimalProviders } from "./providers";
import { RecipeTags } from "../components/RecipePage/RecipeTags/RecipeTags";
import { RecipeProvider } from "../context/RecipeProvider";

const meta: Meta<typeof RecipeTags> = {
  title: "Components/RecipeTags",
  component: RecipeTags,
  decorators: [
    withMSW,
    (Story) => withMinimalProviders(() => (
      <RecipeProvider>
        <Story />
      </RecipeProvider>
    )),
  ],
};
export default meta;

export const Default: StoryObj<typeof RecipeTags> = {};
