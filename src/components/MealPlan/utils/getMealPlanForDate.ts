/**
 * Get meal plan for a specific date
 */
import { formatDateString } from "./formatDateString";

import type { MealPlanWithRecipes } from "../../../clientToServer/types";

export const getMealPlanForDate = (date: Date, mealPlans: MealPlanWithRecipes[]): MealPlanWithRecipes | undefined => {
  const dateStr = formatDateString(date);
  return mealPlans.find(p => p.date === dateStr);
};