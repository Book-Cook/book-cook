import type { Meta, StoryObj } from "@storybook/nextjs";

import { recipeVariants } from "../decorators/withRecipeMocks";
import { createStorySet } from "../utils/storyHelpers";

import { RecipeGallery } from "../../components/RecipeGallery/RecipeGallery";

const meta: Meta<typeof RecipeGallery> = {
  title: "Pages/RecipeGallery",
  component: RecipeGallery,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof RecipeGallery>;

// Create story set for RecipeGallery
const { create } = createStorySet<typeof RecipeGallery>();

// Clean story definitions
export const Default: Story = create("Default (All Recipes)", [recipeVariants.default()]);

export const ManyRecipes: Story = create("Many Recipes", [recipeVariants.many()]);

export const EmptyState: Story = create("Empty State", [recipeVariants.empty()]);

export const ErrorState: Story = create("Error State", [recipeVariants.error()]);

export const LoadingState: Story = create("Loading State", [recipeVariants.loading()]);
