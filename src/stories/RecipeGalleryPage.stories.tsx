import type { Meta, StoryObj } from "@storybook/nextjs";

import { RecipeGallery } from "../components/RecipeGallery/RecipeGallery";

const meta: Meta<typeof RecipeGallery> = {
  title: "Pages/RecipeGallery",
  component: RecipeGallery,
};

export default meta;

export const Default: StoryObj<typeof RecipeGallery> = {};
