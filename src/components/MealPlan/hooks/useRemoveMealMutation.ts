import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MealPlanResponse, TimeSlot } from "../../../clientToServer/types";

interface UseRemoveMealMutationProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Mutation hook for removing a meal from the plan with optimistic updates.
 */
export function useRemoveMealMutation({
  dateRange,
}: UseRemoveMealMutationProps) {
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
      mealIndex,
    }: {
      date: string;
      time: string;
      mealIndex: number;
    }) => {
      const response = await fetch(
        `/api/meal-plans/${date}/${time}/${mealIndex}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to remove meal");
      }
      return response.json();
    },
    onMutate: async ({ date, time, mealIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData<MealPlanResponse>(queryKey);

      queryClient.setQueryData<MealPlanResponse>(queryKey, (old) => {
        if (!old) {
          return old;
        }

        const mealPlans = old.mealPlans.map((plan) => {
          if (plan.date !== date) {
            return plan;
          }

          const timeSlots = plan.meals.timeSlots
            ?.map((slot) => {
              if (slot.time !== time) {
                return slot;
              }

              const newMeals = slot.meals.filter((_, idx) => idx !== mealIndex);

              if (newMeals.length === 0) {
                return null;
              }

              return { ...slot, meals: newMeals };
            })
            .filter((slot): slot is TimeSlot => slot !== null);

          return {
            ...plan,
            meals: { ...plan.meals, timeSlots },
          };
        });

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
