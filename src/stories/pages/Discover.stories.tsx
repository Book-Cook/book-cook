import type { Meta, StoryObj } from "@storybook/nextjs";

import { publicRecipeVariants } from "../decorators/withPublicRecipesMocks";
import { createStorySet } from "../utils/storyHelpers";

import DiscoverPage from "../../pages/discover";

const meta: Meta<typeof DiscoverPage> = {
  title: "Pages/Discover",
  component: DiscoverPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DiscoverPage>;

// Create story set for Discover page
const { create } = createStorySet<typeof DiscoverPage>();

// Story definitions - super clean!
export const Default: Story = create("Default", [publicRecipeVariants.default()]);

export const EmptyState: Story = create("Empty State", [publicRecipeVariants.empty()]);

export const LoadingState: Story = create("Loading State", [publicRecipeVariants.loading()]);

export const ErrorState: Story = create("Error State", [publicRecipeVariants.error()]);

export const ManyRecipes: Story = create("Many Recipes", [publicRecipeVariants.many()]);