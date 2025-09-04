/**
 * Get meals for a specific date from meal plans
 */
import type { TimeSlot } from "../types";
import type { MealPlanWithRecipes, MealItem } from "../../../clientToServer/types";
import { mealTypeToTime } from '../../../utils/timeSlots';

export const getMealsForDate = (date: Date, mealPlans: MealPlanWithRecipes[]): TimeSlot[] => {
  const dateStr = date.toISOString().split("T")[0];
  const plan = mealPlans.find(p => p.date === dateStr);
  
  if (!plan) {
    return [];
  }
  
  // Use time-based slots if available
  if (plan.meals.timeSlots && plan.meals.timeSlots.length > 0) {
    return plan.meals.timeSlots;
  }
  
  // Convert legacy meals to time slots
  const convertedSlots: TimeSlot[] = [];
  
  // Convert legacy meals using shared utility
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  
  mealTypes.forEach(mealType => {
    const meal = plan.meals[mealType];
    if (meal && typeof meal === 'object' && 'recipeId' in meal) {
      const time = mealTypeToTime(mealType);
      const existingSlot = convertedSlots.find(slot => slot.time === time);
      
      if (existingSlot) {
        existingSlot.meals.push(meal as MealItem & { recipe?: Record<string, unknown> });
      } else {
        convertedSlots.push({
          time,
          meals: [meal as MealItem & { recipe?: Record<string, unknown> }],
        });
      }
    }
  });
  
  return convertedSlots.sort((a, b) => a.time.localeCompare(b.time));
};