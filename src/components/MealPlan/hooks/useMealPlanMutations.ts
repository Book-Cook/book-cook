import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseMealPlanMutationsProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export const useMealPlanMutations = ({ dateRange }: UseMealPlanMutationsProps) => {
  const queryClient = useQueryClient();

  const addMealMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {throw new Error("Failed to add meal");}
      return response.json();
    },
    onMutate: async (newMeal) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData(["mealPlans", dateRange.startDate, dateRange.endDate]);

      queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], (old: any) => {
        if (!old) {return old;}
        
        const mealPlans = [...(old.mealPlans ?? [])];
        const date = newMeal.date as string;
        const time = newMeal.time as string;
        const recipeId = newMeal.recipeId as string;
        
        const existingPlanIndex = mealPlans.findIndex((plan: any) => plan.date === date);
        
        const newMealItem = {
          recipeId,
          servings: newMeal.servings ?? 1,
          time,
          duration: newMeal.duration ?? 60,
        };
        
        if (existingPlanIndex >= 0) {
          const plan = { ...mealPlans[existingPlanIndex] };
          
          if (!plan.meals.timeSlots) {
            plan.meals.timeSlots = [];
          } else {
            plan.meals.timeSlots = [...plan.meals.timeSlots];
          }
          
          const existingSlotIndex = plan.meals.timeSlots.findIndex((slot: any) => slot.time === time);
          
          if (existingSlotIndex >= 0) {
            const slot = { ...plan.meals.timeSlots[existingSlotIndex] };
            slot.meals = [...slot.meals, newMealItem];
            plan.meals.timeSlots[existingSlotIndex] = slot;
          } else {
            plan.meals.timeSlots.push({
              time,
              meals: [newMealItem]
            });
          }
          
          mealPlans[existingPlanIndex] = plan;
        } else {
          const newPlan = {
            _id: `temp_${Date.now()}`,
            userId: "temp",
            date,
            meals: {
              timeSlots: [{
                time,
                meals: [newMealItem]
              }]
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
        queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });

  const removeMealMutation = useMutation({
    mutationFn: async ({ date, time, mealIndex }: { date: string; time: string; mealIndex: number }) => {
      const response = await fetch(`/api/meal-plans/${date}/${time}/${mealIndex}`, {
        method: "DELETE",
      });
      if (!response.ok) {throw new Error("Failed to remove meal");}
      return response.json();
    },
    onMutate: async ({ date, time, mealIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData(["mealPlans", dateRange.startDate, dateRange.endDate]);
      
      queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], (old: any) => {
        if (!old) {return old;}
        
        const mealPlans = [...(old.mealPlans ?? [])];
        const planIndex = mealPlans.findIndex((plan: any) => plan.date === date);
        
        if (planIndex >= 0) {
          const plan = { ...mealPlans[planIndex] };
          if (plan.meals.timeSlots) {
            plan.meals.timeSlots = [...plan.meals.timeSlots];
            const slotIndex = plan.meals.timeSlots.findIndex((slot: any) => slot.time === time);
            
            if (slotIndex >= 0) {
              const slot = { ...plan.meals.timeSlots[slotIndex] };
              slot.meals = [...slot.meals];
              slot.meals.splice(mealIndex, 1);
              
              if (slot.meals.length === 0) {
                plan.meals.timeSlots.splice(slotIndex, 1);
              } else {
                plan.meals.timeSlots[slotIndex] = slot;
              }
              
              mealPlans[planIndex] = plan;
            }
          }
        }
        
        return { ...old, mealPlans };
      });
      
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });

  return {
    addMealMutation,
    removeMealMutation,
  };
};