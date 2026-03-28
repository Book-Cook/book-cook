/**
 * Get meals for a specific date from meal plans
 */
import { formatDateString } from './formatDateString';
import type { TimeSlot } from "../types";

import type { MealPlanWithRecipes, MealItem } from "../../../clientToServer/types";
import { mealTypeToTime } from '../../../utils/timeSlots';

export const getMealsForDate = (date: Date, mealPlans: MealPlanWithRecipes[]): TimeSlot[] => {
  const dateStr = formatDateString(date);
  const plan = mealPlans.find(p => p.date === dateStr);
  
  if (!plan) {
    return [];
  }
  
  // Start with existing time slots or empty array
  const allSlots: TimeSlot[] = plan.meals.timeSlots ? [...plan.meals.timeSlots] : [];
  
  // Convert legacy meals using shared utility
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
  
  mealTypes.forEach(mealType => {
    const meal = plan.meals[mealType];
    if (meal && typeof meal === 'object' && 'recipeId' in meal) {
      const time = mealTypeToTime(mealType);
      const existingSlot = allSlots.find(slot => slot.time === time);
      
      if (existingSlot) {
        existingSlot.meals.push(meal as MealItem & { recipe?: Record<string, unknown> });
      } else {
        allSlots.push({
          time,
          meals: [meal as MealItem & { recipe?: Record<string, unknown> }],
        });
      }
    }
  });
  
  return allSlots.sort((a, b) => a.time.localeCompare(b.time));
};