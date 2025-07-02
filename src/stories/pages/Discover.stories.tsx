import type { Meta, StoryObj } from "@storybook/nextjs";

import { withStoryProviders } from "../decorators/withStoryProviders";
import { withApiMocks } from "../mockApi";

import { chocolateChipCookies, thaiGreenCurry, caesarSalad } from "../../mocks/data/recipes";
import DiscoverPage from "../../pages/discover";

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
  decorators: [
    withStoryProviders(),
    withApiMocks({
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
  decorators: [
    withStoryProviders(),
    withApiMocks({
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
  decorators: [
    withStoryProviders(),
    withApiMocks({
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
  decorators: [
    withStoryProviders(),
    withApiMocks({
    '/api/recipes/public': {
      response: { error: 'Failed to fetch public recipes' },
      status: 500,
    },
  })],
};