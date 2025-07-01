import type { Meta, StoryObj } from "@storybook/nextjs";

import { 
  withHomepageMocks, 
  withEmptyMocks, 
  withErrorMocks, 
  withLoadingMocks,
  withApiMocks 
} from "../mockApi";
import DiscoverPage from "../../pages/discover";
import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../../mocks/data/recipes";

const meta: Meta<typeof DiscoverPage> = {
  title: "Pages/Discover",
  component: DiscoverPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DiscoverPage>;

export const Default: Story = {
  name: "Default",
  render: () => <div key="default-story"><DiscoverPage /></div>,
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: [
          {
            ...chocolateChipCookies,
            savedCount: 42,
            viewCount: 203,
            creatorName: "Baker Beth",
          },
          {
            ...thaiGreenCurry,
            savedCount: 31,
            viewCount: 124,
            creatorName: "Thai Kitchen",
          },
          {
            ...caesarSalad,
            savedCount: 18,
            viewCount: 89,
            creatorName: "Chef Caesar",
          },
        ],
        totalCount: 3,
        hasMore: false,
      },
    },
  })],
};

export const EmptyState: Story = {
  name: "Empty State",
  render: () => <div key="empty-story"><DiscoverPage /></div>,
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: [],
        totalCount: 0,
        hasMore: false,
      },
    },
  })],
};

export const LoadingState: Story = {
  name: "Loading State",
  render: () => <div key="loading-story"><DiscoverPage /></div>,
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
        totalCount: 3,
        hasMore: false,
      },
      delay: 999999, // Never resolve to show loading state
    },
  })],
};

export const ErrorState: Story = {
  name: "Error State",
  render: () => <div key="error-story"><DiscoverPage /></div>,
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: { error: 'Failed to fetch public recipes' },
      status: 500,
    },
  })],
};