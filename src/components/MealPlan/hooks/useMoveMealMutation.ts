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

interface UseMoveMealMutationProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Mutation hook for moving a meal between time slots/dates with optimistic updates.
 */
export function useMoveMealMutation({ dateRange }: UseMoveMealMutationProps) {
  const queryClient = useQueryClient();
  const queryKey = [
    "mealPlans",
    dateRange.startDate,
    dateRange.endDate,
  ] as const;

  return useMutation({
    mutationFn: async ({
      sourceDate,
      sourceTime,
      mealIndex,
      targetDate,
      targetTime,
    }: {
      sourceDate: string;
      sourceTime: string;
      mealIndex: number;
      targetDate: string;
      targetTime: string;
    }) => {
      const response = await fetch(
        `/api/meal-plans/${encodeURIComponent(sourceDate)}/${encodeURIComponent(sourceTime)}/move`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mealIndex, targetDate, targetTime }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to move meal");
      }
      return response.json();
    },
    onMutate: async ({
      sourceDate,
      sourceTime,
      mealIndex,
      targetDate,
      targetTime,
    }) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData<MealPlanResponse>(queryKey);

      queryClient.setQueryData<MealPlanResponse>(queryKey, (old) => {
        if (!old) {
          return old;
        }

        const mealPlans = cloneMealPlans(old.mealPlans);

        const sourcePlan = mealPlans.find(
          (planItem) => planItem.date === sourceDate,
        );
        if (!sourcePlan?.meals?.timeSlots) {
          return old;
        }

        const sourceSlotIndex = sourcePlan.meals.timeSlots.findIndex(
          (slot) => slot.time === sourceTime,
        );
        if (sourceSlotIndex === -1) {
          return old;
        }

        const sourceSlot = sourcePlan.meals.timeSlots[sourceSlotIndex];
        if (!sourceSlot.meals || mealIndex >= sourceSlot.meals.length) {
          return old;
        }

        const [mealToMove] = sourceSlot.meals.splice(mealIndex, 1);

        if (sourceSlot.meals.length === 0) {
          sourcePlan.meals.timeSlots.splice(sourceSlotIndex, 1);
        }

        let targetPlan = mealPlans.find(
          (planItem) => planItem.date === targetDate,
        );
        if (!targetPlan) {
          targetPlan = {
            _id: `temp_${Date.now()}`,
            userId: "temp",
            date: targetDate,
            meals: { timeSlots: [] },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mealPlans.push(targetPlan);
        }

        targetPlan.meals ??= { timeSlots: [] };
        targetPlan.meals.timeSlots ??= [];

        const targetSlotIndex = targetPlan.meals.timeSlots.findIndex(
          (slot) => slot.time === targetTime,
        );
        if (targetSlotIndex >= 0) {
          targetPlan.meals.timeSlots[targetSlotIndex] = {
            ...targetPlan.meals.timeSlots[targetSlotIndex],
            meals: [
              ...targetPlan.meals.timeSlots[targetSlotIndex].meals,
              mealToMove,
            ],
          };
        } else {
          targetPlan.meals.timeSlots.push({
            time: targetTime,
            meals: [mealToMove],
          });
        }

        targetPlan.meals.timeSlots.sort((a, b) => a.time.localeCompare(b.time));

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
