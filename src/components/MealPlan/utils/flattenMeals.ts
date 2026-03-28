/**
 * Flatten time slots into individual meal items with metadata
 */
import type { TimeSlot, FlattenedMeal } from "../types";

export const flattenMeals = (
  meals: TimeSlot[], 
  date: string
): FlattenedMeal[] => {
  const flattened: FlattenedMeal[] = [];
  
  meals.forEach(timeSlot => {
    timeSlot.meals.forEach((meal, index) => {
      flattened.push({
        id: `${date}-${timeSlot.time}-${index}`,
        meal,
        time: timeSlot.time,
        index,
      });
    });
  });
  
  return flattened;
};