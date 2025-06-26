import type { Meta, StoryObj } from "@storybook/nextjs";

import { createMockHandlers } from "./mswDecorator";
import { RecipeGallery } from "../components/RecipeGallery/RecipeGallery";
import {
  chocolateChipCookies,
  thaiGreenCurry,
  caesarSalad,
  beefBolognese,
  avocadoToast,
  lemonGarlicSalmon,
} from "../mocks/data/recipes";
import { recipeHandlers } from "../mocks/handlers";

const meta: Meta<typeof RecipeGallery> = {
  title: "Pages/RecipeGallery",
  component: RecipeGallery,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof RecipeGallery>;

// Default story with all recipes
export const Default: Story = {
  name: "Default (All Recipes)",
  parameters: {
    msw: {
      handlers: [...recipeHandlers],
    },
  },
};

// Story with custom recipe collection
export const WithCustomRecipes: Story = {
  name: "Custom Recipe Collection",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [], // no collections needed for this view
        [], // no recently viewed needed
        // Custom recipes for the main gallery
        [chocolateChipCookies, thaiGreenCurry, caesarSalad, beefBolognese]
      ),
    },
  },
};

// Story with only a few recipes
export const FewRecipes: Story = {
  name: "Few Recipes",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [],
        [],
        [chocolateChipCookies, caesarSalad] // Only 2 recipes
      ),
    },
  },
};

// Story with many recipes for testing grid layout
export const ManyRecipes: Story = {
  name: "Many Recipes",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [],
        [],
        [
          chocolateChipCookies,
          thaiGreenCurry,
          caesarSalad,
          beefBolognese,
          avocadoToast,
          lemonGarlicSalmon,
          // Duplicate some with different IDs to show more recipes
          {
            ...chocolateChipCookies,
            _id: "recipe_007",
            title: "Double Chocolate Cookies",
          },
          { ...thaiGreenCurry, _id: "recipe_008", title: "Red Thai Curry" },
          { ...caesarSalad, _id: "recipe_009", title: "Greek Salad" },
          {
            ...beefBolognese,
            _id: "recipe_010",
            title: "Vegetarian Bolognese",
          },
          { ...avocadoToast, _id: "recipe_011", title: "Avocado & Egg Toast" },
          {
            ...lemonGarlicSalmon,
            _id: "recipe_012",
            title: "Herb Crusted Salmon",
          },
        ]
      ),
    },
  },
};

// Empty state story
export const EmptyState: Story = {
  name: "Empty State",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData([], [], []), // No recipes
    },
  },
};

// Loading state story - minimal delay for testing
export const LoadingState: Story = {
  name: "Loading State",
  parameters: {
    msw: {
      handlers: createMockHandlers.loadingState(300), // Short delay for testing
    },
  },
};

// Error state story
export const ErrorState: Story = {
  name: "Error State",
  parameters: {
    msw: {
      handlers: createMockHandlers.apiErrors(),
    },
  },
};

// Story for testing search functionality
export const WithSearchFilter: Story = {
  name: "With Search Filter",
  parameters: {
    msw: {
      handlers: [...recipeHandlers],
    },
  },
  play: async ({ canvasElement: _canvasElement }) => {
    // This would simulate searching but requires additional setup
    // For now, just show the default state
  },
};

// Story for testing tag filtering
export const WithTagFilter: Story = {
  name: "With Tag Filter",
  parameters: {
    msw: {
      handlers: [...recipeHandlers],
    },
  },
};

// Story showing different recipe categories
export const ByCategory: Story = {
  name: "By Category (Desserts)",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [],
        [],
        [
          chocolateChipCookies,
          {
            ...chocolateChipCookies,
            _id: "recipe_013",
            title: "Oatmeal Cookies",
            emoji: "🍪",
          },
          {
            ...chocolateChipCookies,
            _id: "recipe_014",
            title: "Sugar Cookies",
            emoji: "🍪",
          },
          {
            ...chocolateChipCookies,
            _id: "recipe_015",
            title: "Brownies",
            emoji: "🍫",
          },
        ]
      ),
    },
  },
};

// Unauthorized state (no session)  
export const Unauthorized: Story = {
  name: "Unauthorized",
  parameters: {
    session: null, // No authentication for this story
    msw: {
      handlers: [...recipeHandlers],
    },
  },
};
