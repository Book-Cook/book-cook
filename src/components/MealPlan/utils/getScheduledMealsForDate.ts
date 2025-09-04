/**
 * Get all scheduled meals for a date, sorted by time
 */
import { getMealPlanForDate } from "./getMealPlanForDate";

import type { MealPlanWithRecipes, MealItem } from "../../../clientToServer/types";

export const getScheduledMealsForDate = (
  date: Date, 
  mealPlans: MealPlanWithRecipes[]
): Array<{ time: string; meals: Array<MealItem & { recipe?: Record<string, unknown> }> }> => {
  const dayPlan = getMealPlanForDate(date, mealPlans);
  if (!dayPlan) {
    return [];
  }
  
  const scheduledMeals: Array<{ time: string; meals: Array<MealItem & { recipe?: Record<string, unknown> }> }> = [];
  
  // Get time-based slots
  if (dayPlan.meals.timeSlots) {
    scheduledMeals.push(...dayPlan.meals.timeSlots);
  }
  
  // Convert legacy meal types to time slots for display
  const legacyTimeMap = {
    breakfast: '08:00',
    lunch: '12:30', 
    dinner: '18:30',
    snack: '15:00',
  };
  
  Object.entries(legacyTimeMap).forEach(([mealType, time]) => {
    const meal = dayPlan.meals[mealType as keyof typeof dayPlan.meals];
    if (meal && typeof meal === 'object' && 'recipeId' in meal && 'servings' in meal) {
      // Check if we already have a time slot for this time
      const existingSlot = scheduledMeals.find(slot => slot.time === time);
      if (existingSlot) {
        existingSlot.meals.push(meal as MealItem & { recipe?: Record<string, unknown> });
      } else {
        scheduledMeals.push({
          time,
          meals: [meal as MealItem & { recipe?: Record<string, unknown> }]
        });
      }
    }
  });
  
  // Sort by time
  return scheduledMeals.sort((a, b) => a.time.localeCompare(b.time));
};