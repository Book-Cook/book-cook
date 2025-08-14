import type { Meta, StoryObj } from "@storybook/nextjs";

import { mealPlanVariants } from "../decorators/withMealPlanMocks";
import { createStorySet } from "../utils/storyHelpers";

import MealPlanPage from "../../pages/meal-plan";

const meta: Meta<typeof MealPlanPage> = {
  title: "Pages/MealPlan",
  component: MealPlanPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof MealPlanPage>;

// Create story set for MealPlan page
const { create } = createStorySet<typeof MealPlanPage>();

// Story definitions
export const Default: Story = create("Default", [mealPlanVariants.default()]);

export const WithMealPlans: Story = create("With Meal Plans", [mealPlanVariants.withMeals()]);

export const EmptyState: Story = create("Empty State", [mealPlanVariants.empty()]);

export const LoadingState: Story = create("Loading State", [mealPlanVariants.loading()]);

export const ErrorState: Story = create("Error State", [mealPlanVariants.error()]);