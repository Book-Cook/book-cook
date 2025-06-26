import type { Meta, StoryObj } from "@storybook/nextjs";

import { createMockHandlers } from "./mswDecorator";
import HomePage from "../components/HomePage/HomePage";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../mocks/data/recipes";
import { recipeHandlers } from "../mocks/handlers";

const meta: Meta<typeof HomePage> = {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    // Optimize for Chromatic - disable interactions that cause delays
    chromatic: {
      disableSnapshot: false,
      delay: 300,
    },
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

// Chromatic-optimized story with static data for instant rendering
export const ChromaticOptimized: Story = {
  name: "Chromatic Fast",
  parameters: {
    chromatic: {
      delay: 25, // Ultra-fast delay
      disableSnapshot: false,
    },
    // No MSW handlers needed - using static data
    staticData: true,
  },
};

// Default story with the standard MSW handlers (shows actual mock data)
export const Default: Story = {
  name: "Default (With Mock Data)",
  parameters: {
    msw: {
      handlers: [
        ...recipeHandlers,
      ],
    },
  },
};

// Story with empty state
export const EmptyState: Story = {
  name: "Empty State",
  parameters: {
    msw: {
      handlers: createMockHandlers.emptyCollections(),
    },
  },
};

// Story showing loading states
export const LoadingState: Story = {
  name: "Loading State",
  parameters: {
    msw: {
      handlers: createMockHandlers.loadingState(2000),
    },
  },
};

// Story with API errors
export const ErrorState: Story = {
  name: "Error State", 
  parameters: {
    msw: {
      handlers: createMockHandlers.apiErrors(),
    },
  },
};

// Story with custom data using new recipe format
export const WithCustomData: Story = {
  name: "Custom Recipe Data",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [chocolateChipCookies, thaiGreenCurry], // collections
        [caesarSalad, chocolateChipCookies]     // recently viewed
      ),
    },
  },
};

// Story showing only recently viewed (no collections)
export const OnlyRecentlyViewed: Story = {
  name: "Only Recently Viewed",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [], // empty collections
        [thaiGreenCurry, caesarSalad] // recently viewed
      ),
    },
  },
};

// Story showing only collections (no recently viewed)
export const OnlyCollections: Story = {
  name: "Only Collections",
  parameters: {
    msw: {
      handlers: createMockHandlers.withData(
        [chocolateChipCookies, caesarSalad], // collections
        [] // empty recently viewed
      ),
    },
  },
};