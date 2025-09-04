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
        
        const date = newMeal.date as string;
        const time = newMeal.time as string;
        const recipeId = newMeal.recipeId as string;
        
        const newMealItem = {
          recipeId,
          servings: newMeal.servings ?? 1,
          time,
          duration: newMeal.duration ?? 60,
        };
        
        // Deep clone to ensure React detects changes
        const mealPlans = old.mealPlans?.map((plan: any) => {
          if (plan.date !== date) {return plan;}
          
          // Found the plan to update
          const updatedPlan = { ...plan };
          updatedPlan.meals = { ...plan.meals };
          
          if (!updatedPlan.meals.timeSlots) {
            updatedPlan.meals.timeSlots = [];
          } else {
            updatedPlan.meals.timeSlots = [...plan.meals.timeSlots];
          }
          
          const existingSlotIndex = updatedPlan.meals.timeSlots.findIndex((slot: any) => slot.time === time);
          
          if (existingSlotIndex >= 0) {
            // Update existing time slot
            updatedPlan.meals.timeSlots = updatedPlan.meals.timeSlots.map((slot: any, idx: number) => {
              if (idx !== existingSlotIndex) {return slot;}
              return {
                ...slot,
                meals: [...slot.meals, newMealItem]
              };
            });
          } else {
            // Add new time slot
            updatedPlan.meals.timeSlots.push({
              time,
              meals: [newMealItem]
            });
          }
          
          return updatedPlan;
        }) ?? [];
        
        // If plan doesn't exist, add a new one
        const planExists = mealPlans.some((plan: any) => plan.date === date);
        if (!planExists) {
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
        
        // Deep clone to ensure React detects changes
        const mealPlans = old.mealPlans?.map((plan: any) => {
          if (plan.date !== date) {return plan;}
          
          // Found the plan to update
          const updatedPlan = { ...plan };
          updatedPlan.meals = { ...plan.meals };
          
          if (plan.meals.timeSlots) {
            updatedPlan.meals.timeSlots = plan.meals.timeSlots
              .map((slot: any) => {
                if (slot.time !== time) {return slot;}
                
                // Found the time slot to update
                const updatedSlot = { ...slot };
                const newMeals = [...slot.meals];
                newMeals.splice(mealIndex, 1);
                
                // If no meals left in this slot, return null to filter it out
                if (newMeals.length === 0) {
                  return null;
                }
                
                updatedSlot.meals = newMeals;
                return updatedSlot;
              })
              .filter((slot: any) => slot !== null); // Remove empty time slots
          }
          
          return updatedPlan;
        }) ?? [];
        
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

  const reorderMealMutation = useMutation({
    mutationFn: async ({ date, time, oldIndex, newIndex }: { date: string; time: string; oldIndex: number; newIndex: number }) => {
      const response = await fetch(`/api/meal-plans/${date}/${time}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldIndex, newIndex }),
      });
      if (!response.ok) {throw new Error("Failed to reorder meal");}
      return response.json();
    },
    onMutate: async ({ date, time, oldIndex, newIndex }) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData(["mealPlans", dateRange.startDate, dateRange.endDate]);
      
      queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], (old: any) => {
        if (!old) {return old;}
        
        // Create a completely new array to ensure React detects changes
        const mealPlans = JSON.parse(JSON.stringify(old.mealPlans ?? []));
        
        const planIndex = mealPlans.findIndex((plan: any) => plan.date === date);
        if (planIndex === -1) {return old;}
        
        const plan = mealPlans[planIndex];
        if (!plan.meals?.timeSlots) {return old;}
        
        const slotIndex = plan.meals.timeSlots.findIndex((slot: any) => slot.time === time);
        if (slotIndex === -1) {return old;}
        
        const slot = plan.meals.timeSlots[slotIndex];
        if (!slot.meals || slot.meals.length <= oldIndex || slot.meals.length <= newIndex) {
          return old;
        }
        
        // Create new meals array with reordered items
        const newMeals = [...slot.meals];
        const [movedMeal] = newMeals.splice(oldIndex, 1);
        newMeals.splice(newIndex, 0, movedMeal);
        
        // Update the slot with new meals array
        plan.meals.timeSlots[slotIndex] = {
          ...slot,
          meals: newMeals
        };
        
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

  const moveMealMutation = useMutation({
    mutationFn: async ({ 
      sourceDate, 
      sourceTime, 
      mealIndex, 
      targetDate, 
      targetTime 
    }: { 
      sourceDate: string; 
      sourceTime: string; 
      mealIndex: number; 
      targetDate: string; 
      targetTime: string;
    }) => {
      const response = await fetch(`/api/meal-plans/${encodeURIComponent(sourceDate)}/${encodeURIComponent(sourceTime)}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealIndex, targetDate, targetTime }),
      });
      if (!response.ok) {
        throw new Error("Failed to move meal");
      }
      return response.json();
    },
    onMutate: async ({ sourceDate, sourceTime, mealIndex, targetDate, targetTime }) => {
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });
      const previousData = queryClient.getQueryData(["mealPlans", dateRange.startDate, dateRange.endDate]);
      
      queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], (old: any) => {
        if (!old) {return old;}
        
        // Deep clone
        const mealPlans = JSON.parse(JSON.stringify(old.mealPlans ?? []));
        
        // Find source plan
        const sourcePlan = mealPlans.find((plan: any) => plan.date === sourceDate);
        if (!sourcePlan?.meals?.timeSlots) {return old;}
        
        // Find source time slot
        const sourceSlotIndex = sourcePlan.meals.timeSlots.findIndex((slot: any) => slot.time === sourceTime);
        if (sourceSlotIndex === -1) {return old;}
        
        const sourceSlot = sourcePlan.meals.timeSlots[sourceSlotIndex];
        if (!sourceSlot.meals || mealIndex >= sourceSlot.meals.length) {return old;}
        
        // Get the meal to move
        const [mealToMove] = sourceSlot.meals.splice(mealIndex, 1);
        
        // Remove source slot if empty
        if (sourceSlot.meals.length === 0) {
          sourcePlan.meals.timeSlots.splice(sourceSlotIndex, 1);
        }
        
        // Find or create target plan
        let targetPlan = mealPlans.find((plan: any) => plan.date === targetDate);
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
        
        if (!targetPlan.meals) {
          targetPlan.meals = { timeSlots: [] };
        }
        if (!targetPlan.meals.timeSlots) {
          targetPlan.meals.timeSlots = [];
        }
        
        // Find or create target time slot
        const targetSlotIndex = targetPlan.meals.timeSlots.findIndex((slot: any) => slot.time === targetTime);
        if (targetSlotIndex >= 0) {
          targetPlan.meals.timeSlots[targetSlotIndex].meals.push(mealToMove);
        } else {
          targetPlan.meals.timeSlots.push({
            time: targetTime,
            meals: [mealToMove],
          });
        }
        
        // Sort time slots
        targetPlan.meals.timeSlots.sort((a: any, b: any) => a.time.localeCompare(b.time));
        
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
    reorderMealMutation,
    moveMealMutation,
  };
};