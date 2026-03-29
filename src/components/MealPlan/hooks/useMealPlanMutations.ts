import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateMealPlanPayload,
  MealItem,
  MealPlan,
  MealPlanResponse,
  TimeSlot,
} from "../../../clientToServer/types";

interface UseMealPlanMutationsProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

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

export const useMealPlanMutations = ({
  dateRange,
}: UseMealPlanMutationsProps) => {
  const queryClient = useQueryClient();
  const queryKey = [
    "mealPlans",
    dateRange.startDate,
    dateRange.endDate,
  ] as const;

  const addMealMutation = useMutation({
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
            (slot) => slot.time === time
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

  const removeMealMutation = useMutation({
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
        }
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

  const reorderMealMutation = useMutation({
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
          (slot) => slot.time === time
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

  const moveMealMutation = useMutation({
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
        }
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
          (planItem) => planItem.date === sourceDate
        );
        if (!sourcePlan?.meals?.timeSlots) {
          return old;
        }

        const sourceSlotIndex = sourcePlan.meals.timeSlots.findIndex(
          (slot) => slot.time === sourceTime
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
          (planItem) => planItem.date === targetDate
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
          (slot) => slot.time === targetTime
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

  return {
    addMealMutation,
    removeMealMutation,
    reorderMealMutation,
    moveMealMutation,
  };
};
