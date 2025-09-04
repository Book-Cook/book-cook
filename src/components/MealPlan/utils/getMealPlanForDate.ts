/**
 * Get meal plan for a specific date
 */
import type { MealPlanWithRecipes } from "../../../clientToServer/types";

export const getMealPlanForDate = (date: Date, mealPlans: MealPlanWithRecipes[]): MealPlanWithRecipes | undefined => {
  const dateStr = date.toISOString().split("T")[0];
  return mealPlans.find(p => p.date === dateStr);
};