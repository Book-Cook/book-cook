import type { Meta, StoryObj } from "@storybook/react";

import { RecipeCard } from "../../components/RecipeCard";

const meta: Meta<typeof RecipeCard> = {
  title: "Components/RecipeCard",
  component: RecipeCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof RecipeCard>;

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px",
      }}
    >
      {[
        {
          id: "recipe-1",
          title: "Creamy Tomato Soup",
          emoji: "🍲",
          tags: ["Vegetarian", "Dinner", "30 mins", "Comfort"],
          createdDate: new Date().toISOString(),
        },
        {
          id: "recipe-2",
          title: "Spicy Chickpea Curry",
          emoji: "🌶️",
          tags: ["Spicy", "High Protein", "Gluten Free", "Vegan Friendly"],
          createdDate: new Date().toISOString(),
        },
        {
          id: "recipe-3",
          title: "Lemon Blueberry Pancakes",
          emoji: "🥞",
          tags: ["Breakfast", "Sweet", "30 mins"],
          createdDate: new Date().toISOString(),
          isMinimal: true,
        },
        {
          id: "recipe-4",
          title: "Roasted Veggie Grain Bowl",
          emoji: "🥗",
          tags: ["Vegan", "Fiber", "Meal Prep"],
          createdDate: "2023-01-01T00:00:00.000Z",
          isPast: true,
        },
      ].map((card) => (
        <RecipeCard key={card.id} {...card} showActions={false} />
      ))}
    </div>
  ),
};
