import type { Meta, StoryObj } from "@storybook/nextjs";
import { RecipeGallery } from "../components/RecipeGallery/RecipeGallery";
import { 
  withRecipeMocks, 
  withEmptyMocks, 
  withErrorMocks, 
  withLoadingMocks,
  withApiMocks 
} from "./mockApi";
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

// Default story with standard recipe mocks
export const Default: Story = {
  name: "Default (All Recipes)",
  decorators: [withRecipeMocks],
};

// Story with many recipes
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
        // Add some duplicates with different IDs
        { ...chocolateChipCookies, _id: "recipe_007", title: "Double Chocolate Cookies" },
        { ...thaiGreenCurry, _id: "recipe_008", title: "Red Thai Curry" },
        { ...caesarSalad, _id: "recipe_009", title: "Greek Salad" },
      ],
    },
  })],
};

// Empty state story
export const EmptyState: Story = {
  name: "Empty State",
  decorators: [withEmptyMocks],
};

// Error state story
export const ErrorState: Story = {
  name: "Error State", 
  decorators: [withErrorMocks],
};

// Loading state story
export const LoadingState: Story = {
  name: "Loading State",
  decorators: [withLoadingMocks],
};
