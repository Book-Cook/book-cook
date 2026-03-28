import type { Meta, StoryObj } from "@storybook/react";

import { RecipeCard } from "../../components/RecipeCard";
import type { Recipe } from "../../clientToServer/types/recipes.types";

const meta: Meta<typeof RecipeCard> = {
  title: "Components/RecipeCard",
  component: RecipeCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof RecipeCard>;

const sampleRecipes: Recipe[] = [
  {
    _id: "recipe-1",
    title: "Creamy Tomato Soup",
    emoji: "🍲",
    tags: ["Vegetarian", "Dinner", "30 mins", "Comfort"],
    createdAt: new Date().toISOString(),
    data: "",
    imageURL: "",
    owner: "user-1",
    isPublic: false,
  },
  {
    _id: "recipe-2",
    title: "Spicy Chickpea Curry",
    emoji: "🌶️",
    tags: ["Spicy", "High Protein", "Gluten Free", "Vegan Friendly"],
    createdAt: new Date().toISOString(),
    data: "",
    imageURL: "",
    owner: "user-1",
    isPublic: false,
  },
  {
    _id: "recipe-3",
    title: "Lemon Blueberry Pancakes",
    emoji: "🥞",
    tags: ["Breakfast", "Sweet", "30 mins"],
    createdAt: new Date().toISOString(),
    data: "",
    imageURL: "",
    owner: "user-1",
    isPublic: false,
  },
];

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px",
      }}
    >
      {sampleRecipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  ),
};
