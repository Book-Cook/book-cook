import type { Meta, StoryObj } from "@storybook/nextjs";

import { 
  withRecipeMocks, 
  withEmptyMocks, 
  withErrorMocks, 
  withLoadingMocks,
  withApiMocks 
} from "./mockApi";
import { RecipeGallery } from "../components/RecipeGallery/RecipeGallery";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese, avocadoToast, lemonGarlicSalmon } from "../mocks/data/recipes";

const meta: Meta<typeof RecipeGallery> = {
  title: "Pages/RecipeGallery",
  component: RecipeGallery,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof RecipeGallery>;

export const Default: Story = {
  name: "Default (All Recipes)",
  decorators: [withRecipeMocks],
};

export const ManyRecipes: Story = {
  name: "Many Recipes",
  decorators: [withApiMocks({
    '/api/recipes': {
      response: [
        chocolateChipCookies,
        thaiGreenCurry,
        caesarSalad,
        beefBolognese,
        avocadoToast,
        lemonGarlicSalmon,
        { ...chocolateChipCookies, _id: "recipe_007", title: "Double Chocolate Cookies" },
        { ...thaiGreenCurry, _id: "recipe_008", title: "Red Thai Curry" },
        { ...caesarSalad, _id: "recipe_009", title: "Greek Salad" },
      ],
    },
  })],
};

export const EmptyState: Story = {
  name: "Empty State",
  decorators: [withEmptyMocks],
};

export const ErrorState: Story = {
  name: "Error State", 
  decorators: [withErrorMocks],
};

export const LoadingState: Story = {
  name: "Loading State",
  decorators: [withLoadingMocks],
};
