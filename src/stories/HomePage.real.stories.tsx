import type { Meta, StoryObj } from "@storybook/nextjs";
import HomePage from "../components/HomePage/HomePage";
import { 
  withHomepageMocks, 
  withEmptyMocks, 
  withErrorMocks, 
  withLoadingMocks,
  withApiMocks 
} from "./mockApi";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../mocks/data/recipes";

const meta: Meta<typeof HomePage> = {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

// Default story with collections and recently viewed
export const Default: Story = {
  name: "Default",
  decorators: [withHomepageMocks],
};

// Story with empty state
export const EmptyState: Story = {
  name: "Empty State",
  decorators: [withEmptyMocks],
};

// Story showing loading states
export const LoadingState: Story = {
  name: "Loading State",
  decorators: [withLoadingMocks],
};

// Story with API errors
export const ErrorState: Story = {
  name: "Error State", 
  decorators: [withErrorMocks],
};

// Story showing only recently viewed (no collections)
export const OnlyRecentlyViewed: Story = {
  name: "Only Recently Viewed",
  decorators: [withApiMocks({
    '/api/user/collections': {
      response: [], // empty collections
    },
    '/api/user/recentlyViewed': {
      response: [thaiGreenCurry, caesarSalad], // recently viewed
    },
  })],
};

// Story showing only collections (no recently viewed)
export const OnlyCollections: Story = {
  name: "Only Collections",
  decorators: [withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, caesarSalad], // collections
    },
    '/api/user/recentlyViewed': {
      response: [], // empty recently viewed
    },
  })],
};