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
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
        totalCount: 3,
        hasMore: false,
      },
    },
  })],
};

export const EmptyState: Story = {
  name: "Empty State",
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
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: {
        recipes: [chocolateChipCookies, thaiGreenCurry, caesarSalad],
        totalCount: 3,
        hasMore: false,
      },
      delay: 2000,
    },
  })],
};

export const ErrorState: Story = {
  name: "Error State", 
  decorators: [withApiMocks({
    '/api/recipes/public': {
      response: { error: 'Failed to fetch public recipes' },
      status: 500,
    },
  })],
};