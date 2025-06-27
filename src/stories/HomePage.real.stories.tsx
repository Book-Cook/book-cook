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

export const Default: Story = {
  name: "Default",
  decorators: [withHomepageMocks],
};

export const EmptyState: Story = {
  name: "Empty State",
  decorators: [withEmptyMocks],
};

export const LoadingState: Story = {
  name: "Loading State",
  decorators: [withLoadingMocks],
};

export const ErrorState: Story = {
  name: "Error State", 
  decorators: [withErrorMocks],
};

export const OnlyRecentlyViewed: Story = {
  name: "Only Recently Viewed",
  decorators: [withApiMocks({
    '/api/user/collections': {
      response: [],
    },
    '/api/user/recentlyViewed': {
      response: [thaiGreenCurry, caesarSalad],
    },
  })],
};

export const OnlyCollections: Story = {
  name: "Only Collections",
  decorators: [withApiMocks({
    '/api/user/collections': {
      response: [chocolateChipCookies, caesarSalad],
    },
    '/api/user/recentlyViewed': {
      response: [],
    },
  })],
};