import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateMealPlanPayload,
  MealItem,
  MealPlan,
  MealPlanResponse,
  TimeSlot,
} from "../../../clientToServer/types";

interface UseAddMealMutationProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Mutation hook for adding a meal to the plan with optimistic updates.
 */
export function useAddMealMutation({ dateRange }: UseAddMealMutationProps) {
  const queryClient = useQueryClient();
  const queryKey = [
    "mealPlans",
    dateRange.startDate,
    dateRange.endDate,
  ] as const;

  return useMutation({
    mutationFn: async (payload: CreateMealPlanPayload) => {
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to add meal");
      }
      return response.json();
    },
    onMutate: async (newMeal) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData<MealPlanResponse>(queryKey);

      queryClient.setQueryData<MealPlanResponse>(queryKey, (old) => {
        if (!old) {
          return old;
        }

        const { date, time, recipeId } = newMeal;

        const newMealItem: MealItem = {
          recipeId,
          servings: newMeal.servings ?? 1,
          time,
          duration: newMeal.duration ?? 60,
        };

        const mealPlans = old.mealPlans.map((plan) => {
          if (plan.date !== date) {
            return plan;
          }

          const timeSlots: TimeSlot[] = plan.meals.timeSlots
            ? plan.meals.timeSlots.map((slot) => ({
                ...slot,
                meals: [...slot.meals],
              }))
            : [];

          const existingSlotIndex = timeSlots.findIndex(
            (slot) => slot.time === time,
          );

          if (existingSlotIndex >= 0) {
            const slot = timeSlots[existingSlotIndex];
            timeSlots[existingSlotIndex] = {
              ...slot,
              meals: [...slot.meals, newMealItem],
            };
          } else {
            timeSlots.push({
              time,
              meals: [newMealItem],
            });
          }

          return {
            ...plan,
            meals: { ...plan.meals, timeSlots },
          };
        });

        // If plan doesn't exist, add a new one
        const planExists = mealPlans.some((plan) => plan.date === date);
        if (!planExists) {
          const newPlan: MealPlan = {
            _id: `temp_${Date.now()}`,
            userId: "temp",
            date,
            meals: {
              timeSlots: [
                {
                  time,
                  meals: [newMealItem],
                },
              ],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mealPlans.push(newPlan);
        }

        return { ...old, mealPlans };
      });

      return { previousData };
    },
    onError: (_err, _newMeal, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });
}
