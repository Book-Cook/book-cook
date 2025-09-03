import type { MealPlanWithRecipes, MealItem } from "../../../clientToServer/types";

interface TimeSlot {
  time: string;
  meals: Array<MealItem & { recipe?: Record<string, unknown> }>;
}

const LEGACY_TIME_MAP = {
  breakfast: '08:00',
  lunch: '12:30',
  dinner: '18:30',
  snack: '15:00',
} as const;

export const getMealsForDate = (date: Date, mealPlans: MealPlanWithRecipes[]): TimeSlot[] => {
  const dateStr = date.toISOString().split("T")[0];
  const plan = mealPlans.find(p => p.date === dateStr);
  
  if (!plan) {
    return [];
  }
  
  const timeSlots = plan.meals.timeSlots ?? [];
  const convertedSlots = [...timeSlots];
  
  convertLegacyMeals(plan, convertedSlots);
  
  return convertedSlots.sort((a, b) => a.time.localeCompare(b.time));
};

const convertLegacyMeals = (
  plan: MealPlanWithRecipes, 
  convertedSlots: TimeSlot[]
): void => {
  Object.entries(LEGACY_TIME_MAP).forEach(([mealType, time]) => {
    const meal = plan.meals[mealType as keyof typeof plan.meals];
    if (meal && typeof meal === 'object' && 'recipeId' in meal) {
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
};

export const flattenMeals = (
  meals: TimeSlot[], 
  date: string
): Array<{
  id: string;
  meal: MealItem & { recipe?: Record<string, unknown> };
  time: string;
  index: number;
}> => {
  const flattened: Array<{
    id: string;
    meal: MealItem & { recipe?: Record<string, unknown> };
    time: string;
    index: number;
  }> = [];
  
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