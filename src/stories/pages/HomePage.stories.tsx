import type { Meta, StoryObj } from "@storybook/nextjs";

import { homepageVariants } from "../decorators/withHomepageMocks";
import { createStorySet } from "../utils/storyHelpers";

import HomePage from "../../components/HomePage/HomePage";

const meta: Meta<typeof HomePage> = {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof HomePage>;

// Create story set for HomePage
const { create } = createStorySet<typeof HomePage>();

// Clean story definitions
export const Default: Story = create("Default", [homepageVariants.default()]);

export const EmptyState: Story = create("Empty State", [homepageVariants.empty()]);

export const LoadingState: Story = create("Loading State", [homepageVariants.loading()]);

export const ErrorState: Story = create("Error State", [homepageVariants.error()]);

export const OnlyRecentlyViewed: Story = create("Only Recently Viewed", [homepageVariants.onlyRecentlyViewed()]);

export const OnlyCollections: Story = create("Only Collections", [homepageVariants.onlyCollections()]);