import type { Meta, StoryObj } from "@storybook/nextjs";

import { publicRecipeVariants } from "../decorators/withPublicRecipesMocks";
import { recipeVariants } from "../decorators/withRecipeMocks";
import { createStorySet } from "../utils/storyHelpers";

import { UnifiedRecipeGallery } from "../../components/UnifiedRecipeGallery/UnifiedRecipeGallery";

const meta: Meta<typeof UnifiedRecipeGallery> = {
  title: "Pages/Recipes",
  component: UnifiedRecipeGallery,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof UnifiedRecipeGallery>;

// Create story set for UnifiedRecipeGallery
const { create } = createStorySet<typeof UnifiedRecipeGallery>();

// Stories for My Recipes Tab (default)
export const MyRecipesDefault: Story = create("My Recipes - Default", [recipeVariants.default()]);

export const MyRecipesManyRecipes: Story = create("My Recipes - Many Recipes", [recipeVariants.many()]);

export const MyRecipesEmptyState: Story = create("My Recipes - Empty State", [recipeVariants.empty()]);

export const MyRecipesErrorState: Story = create("My Recipes - Error State", [recipeVariants.error()]);

export const MyRecipesLoadingState: Story = create("My Recipes - Loading State", [recipeVariants.loading()]);

// Stories for Community Tab
export const CommunityDefault: Story = {
  ...create("Community - Default", [publicRecipeVariants.default()]),
  args: {
    initialTab: "community"
  }
};

export const CommunityManyRecipes: Story = {
  ...create("Community - Many Recipes", [publicRecipeVariants.many()]),
  args: {
    initialTab: "community"
  }
};

export const CommunityEmptyState: Story = {
  ...create("Community - Empty State", [publicRecipeVariants.empty()]),
  args: {
    initialTab: "community"
  }
};

export const CommunityErrorState: Story = {
  ...create("Community - Error State", [publicRecipeVariants.error()]),
  args: {
    initialTab: "community"
  }
};

export const CommunityLoadingState: Story = {
  ...create("Community - Loading State", [publicRecipeVariants.loading()]),
  args: {
    initialTab: "community"
  }
};
