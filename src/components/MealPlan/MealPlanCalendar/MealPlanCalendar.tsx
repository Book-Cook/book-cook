import * as React from "react";
import { Button, Text } from "@fluentui/react-components";
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
  CalendarToday24Regular,
} from "@fluentui/react-icons";
import type { DragEndEvent} from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useStyles } from "./MealPlanCalendar.styles";
import type { MealPlanCalendarProps, CalendarView, DraggedRecipe } from "./MealPlanCalendar.types";
import { CondensedWeekView } from "../CalendarViews/CondensedWeekView";
import { HourlyDayView } from "../CalendarViews/HourlyDayView";
import { MonthView } from "../CalendarViews/MonthView";
import { MealPlanSidebar } from "../MealPlanSidebar/MealPlanSidebar";
import { RecipeDragCard } from "../RecipeDragCard/RecipeDragCard";
import { TimePicker } from "../TimePicker/TimePicker";

export const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({ 
  initialView = "week" 
}) => {
  const styles = useStyles();
  const queryClient = useQueryClient();
  const [view, setView] = React.useState<CalendarView>(initialView);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [draggedRecipe, setDraggedRecipe] = React.useState<DraggedRecipe | null>(null);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [pendingMeal, setPendingMeal] = React.useState<{
    recipe: DraggedRecipe;
    date: string;
  } | null>(null);

  // Calculate date range based on view
  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (view === "day") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (view === "week") {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  // Fetch meal plans for current date range
  // Using date range as key instead of view so data is shared across views
  const dateRange = getDateRange();
  const { data: mealPlansData } = useQuery({
    queryKey: ["mealPlans", dateRange.startDate, dateRange.endDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/meal-plans?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      if (!response.ok) {throw new Error("Failed to fetch meal plans");}
      return response.json();
    },
  });

  // Add meal mutation with optimistic updates
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
      // Cancel any outgoing refetches for all meal plan queries
      await queryClient.cancelQueries({ queryKey: ["mealPlans"] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["mealPlans", dateRange.startDate, dateRange.endDate]);

      // Optimistically update the cache for this date range
      queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], (old: any) => {
        if (!old) {return old;}
        
        const mealPlans = [...(old.mealPlans || [])];
        const date = newMeal.date as string;
        const time = newMeal.time as string;
        const recipeId = newMeal.recipeId as string;
        
        // Find existing meal plan for the date
        const existingPlanIndex = mealPlans.findIndex((plan: any) => plan.date === date);
        
        const newMealItem = {
          recipeId,
          servings: newMeal.servings || 1,
          time,
          duration: newMeal.duration || 60,
        };
        
        if (existingPlanIndex >= 0) {
          const plan = { ...mealPlans[existingPlanIndex] };
          
          // Initialize timeSlots if not exists
          if (!plan.meals.timeSlots) {
            plan.meals.timeSlots = [];
          } else {
            plan.meals.timeSlots = [...plan.meals.timeSlots];
          }
          
          // Find existing time slot or create new one
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
          // Create new meal plan
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
    onError: (err, newMeal, context) => {
      // Revert the optimistic update on error
      if (context?.previousData) {
        queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], context.previousData);
      }
    },
    onSettled: () => {
      // Invalidate all meal plan queries to ensure consistency across views
      void queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });

  // Remove meal mutation with optimistic updates
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
        
        const mealPlans = [...(old.mealPlans || [])];
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
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["mealPlans", dateRange.startDate, dateRange.endDate], context.previousData);
      }
    },
    onSettled: () => {
      // Invalidate all meal plan queries to ensure consistency across views
      void queryClient.invalidateQueries({ queryKey: ["mealPlans"] });
    },
  });

  // Navigation handlers
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Format date display
  const formatDateDisplay = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };

    if (view === "day") {
      options.day = "numeric";
      options.weekday = "long";
    } else if (view === "week") {
      const start = new Date(currentDate);
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      
      return `${start.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      })} - ${end.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric",
        year: "numeric"
      })}`;
    }

    return currentDate.toLocaleDateString("en-US", options);
  };

  // Drag and drop handlers
  const handleDragStart = (event: { active: { data: { current?: { recipe?: DraggedRecipe } } } }) => {
    const recipe = event.active.data.current?.recipe;
    if (recipe) {
      setDraggedRecipe(recipe);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggedRecipe(null);
      return;
    }

    const recipe = active.data.current?.recipe;
    const dropTarget = over.data.current;

    if (recipe && dropTarget?.date) {
      // If we have a specific time slot, use it directly
      if (dropTarget.time) {
        const payload: Record<string, unknown> = {
          date: dropTarget.date,
          recipeId: recipe.id,
          servings: 1,
          time: dropTarget.time,
          duration: 60,
        };

        addMealMutation.mutate(payload);
      } 
      // If it's a month view day, week view drop zone, or general day drop - show time picker
      else if (dropTarget.type === "month-day" || dropTarget.type === "week-day" || view === "week" || view === "month") {
        setPendingMeal({ recipe, date: dropTarget.date });
        setShowTimePicker(true);
      }
      // Legacy meal type support
      else if (dropTarget.mealType) {
        const payload: Record<string, unknown> = {
          date: dropTarget.date,
          recipeId: recipe.id,
          servings: 1,
          mealType: dropTarget.mealType,
        };

        addMealMutation.mutate(payload);
      }
    }

    setDraggedRecipe(null);
  };

  const handleTimeSelect = (time: string) => {
    if (pendingMeal) {
      const payload: Record<string, unknown> = {
        date: pendingMeal.date,
        recipeId: pendingMeal.recipe.id,
        servings: 1,
        time,
        duration: 60,
      };

      addMealMutation.mutate(payload);
      setPendingMeal(null);
    }
  };

  // Render current view
  const renderView = () => {
    const timeMealRemove = async (date: string, time: string, mealIndex: number): Promise<void> => {
      return new Promise<void>((resolve) => {
        removeMealMutation.mutate({ date, time, mealIndex });
        resolve();
      });
    };

    const dayWeekProps = {
      currentDate,
      mealPlans: mealPlansData?.mealPlans ?? [],
      onMealRemove: timeMealRemove,
    };

    const monthProps = {
      currentDate,
      mealPlans: mealPlansData?.mealPlans ?? [],
      onMealRemove: timeMealRemove,
    };

    switch (view) {
      case "day":
        return <HourlyDayView {...dayWeekProps} />;
      case "week":
        return <CondensedWeekView {...dayWeekProps} />;
      case "month":
        return <MonthView {...monthProps} />;
      default:
        return <CondensedWeekView {...dayWeekProps} />;
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <MealPlanSidebar />
        </div>
        
        <div className={styles.main}>
          <div className={styles.viewControls}>
            <Button
              appearance={view === "day" ? "primary" : "subtle"}
              className={styles.viewButton}
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              appearance={view === "week" ? "primary" : "subtle"}
              className={styles.viewButton}
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              appearance={view === "month" ? "primary" : "subtle"}
              className={styles.viewButton}
              onClick={() => setView("month")}
            >
              Month
            </Button>
            
            <Text className={styles.dateDisplay}>
              {formatDateDisplay()}
            </Text>
            
            <div className={styles.navigationButtons}>
              <Button
                appearance="subtle"
                icon={<ChevronLeft24Regular />}
                onClick={handlePrevious}
                title="Previous"
              />
              <Button
                appearance="subtle"
                icon={<CalendarToday24Regular />}
                onClick={handleToday}
              >
                Today
              </Button>
              <Button
                appearance="subtle"
                icon={<ChevronRight24Regular />}
                onClick={handleNext}
                title="Next"
              />
            </div>
          </div>
          
          <div className={styles.calendarContent}>
            {renderView()}
          </div>
        </div>
      </div>
      
      <DragOverlay>
        {draggedRecipe && (
          <RecipeDragCard
            id={draggedRecipe.id}
            title={draggedRecipe.title}
            emoji={draggedRecipe.emoji}
            isDragging
          />
        )}
      </DragOverlay>
      
      <TimePicker
        isOpen={showTimePicker}
        onOpenChange={setShowTimePicker}
        onTimeSelect={handleTimeSelect}
        defaultTime="12:00"
      />
    </DndContext>
  );
};