import type { Meta, StoryObj } from "@storybook/react";

import { MealCard } from "../../components/MealPlan/WeekView";

const meta: Meta<typeof MealCard> = {
  title: "Components/MealCard",
  component: MealCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof MealCard>;

export const Examples: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        height: "240px",
        border: "1px dashed #ccc",
        padding: "8px",
        borderRadius: "8px",
        background: "#fafafa",
      }}
    >
      <MealCard
        id="meal-1"
        recipeId="recipe-1"
        title="Spaghetti Carbonara"
        emoji="🍝"
        time="12:30"
        duration={60}
        position={16}
        date="2024-01-15"
        mealIndex={0}
        onRemove={() => console.log("Removed Spaghetti Carbonara")}
      />
      <MealCard
        id="meal-2"
        recipeId="recipe-2"
        title="Avocado Toast with Poached Egg"
        emoji="🥑"
        time="14:00"
        duration={90}
        position={96}
        date="2024-01-15"
        mealIndex={1}
        onRemove={() => console.log("Removed Avocado Toast")}
      />
      <MealCard
        id="meal-3"
        recipeId="recipe-3"
        title="Quick Protein Smoothie"
        emoji="🍓"
        time="08:00"
        duration={30}
        position={180}
        date="2024-01-15"
        mealIndex={2}
        onRemove={() => console.log("Removed Smoothie")}
      />
    </div>
  ),
};
