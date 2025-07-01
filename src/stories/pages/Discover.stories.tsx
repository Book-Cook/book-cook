import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DiscoverPage from "../../pages/discover";

const meta: Meta<typeof DiscoverPage> = {
  title: "Pages/Discover",
  component: DiscoverPage,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ minHeight: "100vh" }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof DiscoverPage>;

const mockPublicRecipes = {
  recipes: [
    {
      _id: "recipe1",
      title: "Amazing Pasta Carbonara",
      tags: ["italian", "pasta", "comfort-food"],
      createdAt: "2024-01-15T10:30:00.000Z",
      emoji: "🍝",
      imageURL: "",
      savedCount: 24,
      viewCount: 156,
      creatorName: "Chef Marco",
      owner: "user123",
    },
    {
      _id: "recipe2",
      title: "Healthy Buddha Bowl",
      tags: ["healthy", "vegetarian", "quinoa"],
      createdAt: "2024-01-14T14:20:00.000Z",
      emoji: "🥗",
      imageURL: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      savedCount: 18,
      viewCount: 89,
      creatorName: "Sarah Green",
      owner: "user456",
    },
    {
      _id: "recipe3",
      title: "Classic Chocolate Chip Cookies",
      tags: ["dessert", "cookies", "chocolate"],
      createdAt: "2024-01-13T16:45:00.000Z",
      emoji: "🍪",
      imageURL: "",
      savedCount: 42,
      viewCount: 203,
      creatorName: "Baker Beth",
      owner: "user789",
    },
    {
      _id: "recipe4",
      title: "Spicy Thai Green Curry",
      tags: ["thai", "spicy", "curry", "asian"],
      createdAt: "2024-01-12T12:15:00.000Z",
      emoji: "🍛",
      imageURL: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
      savedCount: 31,
      viewCount: 124,
      creatorName: "Thai Kitchen",
      owner: "user321",
    },
    {
      _id: "recipe5",
      title: "Perfect Avocado Toast",
      tags: ["breakfast", "healthy", "avocado", "quick"],
      createdAt: "2024-01-11T08:00:00.000Z",
      emoji: "🥑",
      imageURL: "",
      savedCount: 15,
      viewCount: 67,
      creatorName: "Morning Chef",
      owner: "user654",
    },
    {
      _id: "recipe6",
      title: "BBQ Pulled Pork Sandwich",
      tags: ["bbq", "pork", "sandwich", "comfort-food"],
      createdAt: "2024-01-10T18:30:00.000Z",
      emoji: "🥪",
      imageURL: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      savedCount: 28,
      viewCount: 145,
      creatorName: "BBQ Master",
      owner: "user987",
    },
  ],
  totalCount: 147,
  hasMore: true,
};

export const Default: Story = {
  parameters: {
    // Note: This story shows the loading state since we don't have MSW configured
    // In a real environment, this would load data from the API
  },
};