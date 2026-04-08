/**
 * Optimistic update utilities for meal movement and reordering
 */
import type { MealPlanWithRecipes } from "../../../clientToServer/types";

type MoveMealPayload = {
  date?: string;
  time?: string;
  mealIndex?: number;
  newTime?: string;
};

/**
 * Move meal optimistically between time slots
 */
export function moveMealOptimistically(
  oldData: MealPlanWithRecipes[] | undefined,
  moveData: MoveMealPayload,
) {
  if (!oldData) {
    return oldData;
  }

  const { date, time, mealIndex, newTime } = moveData;

  return oldData.map((plan) => {
    if (plan.date !== date) {
      return plan;
    }

    const updatedPlan = { ...plan };
    const sourceSlot = updatedPlan.meals.timeSlots?.find(
      (slot) => slot.time === time,
    );

    if (sourceSlot && sourceSlot.meals.length > (mealIndex as number)) {
      // Remove meal from source
      const [movedMeal] = sourceSlot.meals.splice(mealIndex as number, 1);

      // Add to target
      const targetSlot = updatedPlan.meals.timeSlots?.find(
        (slot) => slot.time === newTime,
      );
      if (targetSlot) {
        targetSlot.meals.push(movedMeal);
      } else {
        updatedPlan.meals.timeSlots = [
          ...(updatedPlan.meals.timeSlots ?? []),
          { time: newTime as string, meals: [movedMeal] },
        ];
      }

      // Clean up empty source slot
      if (sourceSlot.meals.length === 0) {
        updatedPlan.meals.timeSlots = updatedPlan.meals.timeSlots?.filter(
          (slot) => slot.time !== time,
        );
      }
    }

    return updatedPlan;
  });
}

/**
 * Reorder meals optimistically within same time slot
 */
export function reorderMealsOptimistically(
  oldData: MealPlanWithRecipes[] | undefined,
  reorderData: Record<string, unknown>,
) {
  if (!oldData) {
    return oldData;
  }

  const { date, time, oldIndex, newIndex } = reorderData;

  return oldData.map((plan) => {
    if (plan.date !== date) {
      return plan;
    }

    const updatedPlan = { ...plan };
    const timeSlot = updatedPlan.meals.timeSlots?.find(
      (slot) => slot.time === time,
    );

    if (
      timeSlot &&
      timeSlot.meals.length > Math.max(oldIndex as number, newIndex as number)
    ) {
      const meals = [...timeSlot.meals];
      const [movedMeal] = meals.splice(oldIndex as number, 1);
      meals.splice(newIndex as number, 0, movedMeal);
      timeSlot.meals = meals;
    }

    return updatedPlan;
  });
}
