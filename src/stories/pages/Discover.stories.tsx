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

// Advanced examples showing the power of abstraction
export const ManyRecipes: Story = create("Many Recipes", [
  publicRecipeVariants.custom(
    [
      { title: "Chocolate Chip Cookies", savedCount: 50, viewCount: 200, creatorName: "Baker Beth" },
      { title: "Thai Green Curry", savedCount: 35, viewCount: 150, creatorName: "Thai Kitchen" },
      { title: "Caesar Salad", savedCount: 20, viewCount: 100, creatorName: "Chef Caesar" },
      { title: "Beef Bolognese", savedCount: 45, viewCount: 180, creatorName: "Italian Chef" },
      { title: "Avocado Toast", savedCount: 30, viewCount: 120, creatorName: "Health Guru" },
    ],
    { totalCount: 50, hasMore: true }
  )
]);