/**
 * Optimistic update utilities for meal plan mutations
 */
import type {
  CreateMealPlanPayload,
  MealPlanWithRecipes,
  MealType,
} from "../../../clientToServer/types";
import { mealTypeToTime } from "../../../utils/timeSlots";

export interface OptimisticUpdateContext {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

type NewMealPayload = Partial<CreateMealPlanPayload> & { mealType?: string };

/**
 * Add meal optimistically to meal plans data
 */
export function addMealOptimistically(
  oldData: MealPlanWithRecipes[] | undefined,
  newMeal: NewMealPayload,
  _context: OptimisticUpdateContext,
) {
  if (!oldData || !newMeal.date) {
    return oldData;
  }

  const { date, time, mealType } = newMeal;

  return oldData.map((plan) => {
    if (plan.date !== date) {
      return plan;
    }

    const updatedPlan = { ...plan };

    if (time && time !== mealType) {
      // Add to time slots
      const existingSlot = updatedPlan.meals.timeSlots?.find(
        (slot) => slot.time === time,
      );
      const newMealItem = {
        recipeId: newMeal.recipeId ?? "",
        servings: newMeal.servings ?? 1,
        time,
        duration: newMeal.duration ?? 60,
      };

      if (existingSlot) {
        existingSlot.meals.push(newMealItem);
      } else {
        updatedPlan.meals.timeSlots = [
          ...(updatedPlan.meals.timeSlots ?? []),
          { time, meals: [newMealItem] },
        ];
      }
    } else if (mealType) {
      // Legacy meal type
      const legacyKey = mealType as MealType;
      const legacyMealTypes: MealType[] = [
        "breakfast",
        "lunch",
        "dinner",
        "snack",
      ];
      if (!legacyMealTypes.includes(legacyKey)) {
        return plan;
      }
      const meals = { ...updatedPlan.meals };
      const defaultTime = time ?? mealTypeToTime(legacyKey);
      meals[legacyKey] = {
        recipeId: newMeal.recipeId ?? "",
        servings: newMeal.servings ?? 1,
        time: defaultTime,
        duration: newMeal.duration ?? 60,
      };
      updatedPlan.meals = meals;
    }

    return updatedPlan;
  });
}

/**
 * Remove meal optimistically from meal plans data
 */
export function removeMealOptimistically(
  oldData: MealPlanWithRecipes[] | undefined,
  date: string,
  time: string,
  mealIndex: number,
) {
  if (!oldData) {
    return oldData;
  }

  return oldData.map((plan) => {
    if (plan.date !== date) {
      return plan;
    }

    const updatedPlan = { ...plan };

    // Check if it's a legacy meal type
    const legacyTypes = ["breakfast", "lunch", "dinner", "snack"];
    if (legacyTypes.includes(time)) {
      const meals = { ...updatedPlan.meals };
      delete meals[time as keyof MealPlanWithRecipes["meals"]];
      updatedPlan.meals = meals;
    } else {
      // Remove from time slots
      const timeSlot = updatedPlan.meals.timeSlots?.find(
        (slot) => slot.time === time,
      );
      if (timeSlot && timeSlot.meals.length > mealIndex) {
        timeSlot.meals.splice(mealIndex, 1);

        // Remove empty time slot
        if (timeSlot.meals.length === 0) {
          updatedPlan.meals.timeSlots = updatedPlan.meals.timeSlots?.filter(
            (slot) => slot.time !== time,
          );
        }
      }
    }

    return updatedPlan;
  });
}

