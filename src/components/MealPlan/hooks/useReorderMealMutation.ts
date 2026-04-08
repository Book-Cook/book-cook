import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MealPlan, MealPlanResponse } from "../../../clientToServer/types";

const cloneMealPlans = (mealPlans: MealPlan[]): MealPlan[] =>
  mealPlans.map((plan) => ({
    ...plan,
    meals: {
      ...plan.meals,
      timeSlots: plan.meals.timeSlots?.map((slot) => ({
        ...slot,
        meals: [...slot.meals],
      })),
    },
  }));

interface UseReorderMealMutationProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Mutation hook for reordering meals within a time slot with optimistic updates.
 */
export function useReorderMealMutation({
  dateRange,
}: UseReorderMealMutationProps) {
  const queryClient = useQueryClient();
  const queryKey = [
    "mealPlans",
    dateRange.startDate,
    dateRange.endDate,
  ] as const;

  return useMutation({
    mutationFn: async ({
      date,
      time,
      oldIndex,
      newIndex,
    }: {
      date: string;
      time: string;
      oldIndex: number;
      newIndex: number;
    }) => {
      const response = await fetch(`/api/meal-plans/${date}/${time}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldIndex, newIndex }),
      });
      if (!response.ok) {
        throw new Error("Failed to reorder meal");
      }
      return response.json();
    },
    onMutate: async ({ date, time, oldIndex, newIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData<MealPlanResponse>(queryKey);

      queryClient.setQueryData<MealPlanResponse>(queryKey, (old) => {
        if (!old) {
          return old;
        }

        const mealPlans = cloneMealPlans(old.mealPlans);

        const plan = mealPlans.find((planItem) => planItem.date === date);
        if (!plan?.meals?.timeSlots) {
          return old;
        }

        const slotIndex = plan.meals.timeSlots.findIndex(
          (slot) => slot.time === time,
        );
        if (slotIndex === -1) {
          return old;
        }

        const slot = plan.meals.timeSlots[slotIndex];
        if (
          !slot.meals ||
          slot.meals.length <= oldIndex ||
          slot.meals.length <= newIndex
        ) {
          return old;
        }

        const newMeals = [...slot.meals];
        const [movedMeal] = newMeals.splice(oldIndex, 1);
        newMeals.splice(newIndex, 0, movedMeal);

        plan.meals.timeSlots[slotIndex] = {
          ...slot,
          meals: newMeals,
        };

        return { ...old, mealPlans };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });
}
