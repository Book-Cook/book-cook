import * as React from "react";
import { Button, mergeClasses } from "@fluentui/react-components";
import { PanelLeft24Regular } from "@fluentui/react-icons";
import type { DragEndEvent} from "@dnd-kit/core";
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useQuery } from "@tanstack/react-query";

import { useStyles } from "./MealPlanCalendar.styles";
import type { MealPlanCalendarProps, CalendarView, DraggedRecipe } from "./MealPlanCalendar.types";
import { CalendarToolbar } from "../CalendarToolbar/CalendarToolbar";
import { HourlyDayView } from "../CalendarViews/HourlyDayView";
import { MonthView } from "../CalendarViews/MonthView";
import { useMealPlanMutations } from "../hooks/useMealPlanMutations";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { MealPlanSidebar } from "../MealPlanSidebar/MealPlanSidebar";
import { RecipeDragCard } from "../RecipeDragCard/RecipeDragCard";
import { TimePicker } from "../TimePicker/TimePicker";
import WeekView from "../WeekView";

export const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({ 
  initialView = "week" 
}) => {
  const styles = useStyles();
  const [view, setView] = React.useState<CalendarView>(initialView);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [draggedRecipe, setDraggedRecipe] = React.useState<DraggedRecipe | null>(null);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [pendingMeal, setPendingMeal] = React.useState<{
    recipe: DraggedRecipe;
    date: string;
  } | null>(null);
  
  // Sidebar state and resizing
  const { sidebarWidth, isMobile, handleMouseDown } = useSidebarResize();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Close sidebar when switching from mobile to desktop
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const wasMovingToDesktop = isMobile && !e.matches;
      if (wasMovingToDesktop && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isMobile, sidebarOpen]);

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

  // Use meal plan mutations
  const { addMealMutation, removeMealMutation, reorderMealMutation, moveMealMutation } = useMealPlanMutations({ dateRange });

  // Navigation handlers
  const handlePrevious = React.useCallback(() => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  }, [currentDate, view]);

  const handleNext = React.useCallback(() => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  }, [currentDate, view]);

  const handleToday = React.useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Drag and drop handlers
  const handleDragStart = React.useCallback((event: { active: { data: { current?: { recipe?: DraggedRecipe; type?: string; title?: string; emoji?: string } } } }) => {
    const data = event.active.data.current;
    if (data?.recipe) {
      setDraggedRecipe(data.recipe);
    } else if (data?.type === 'meal-card') {
      // Set a dragged recipe for meal cards too
      setDraggedRecipe({
        id: '',
        title: data.title || 'Meal',
        emoji: data.emoji || undefined
      });
    }
  }, []);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggedRecipe(null);
      return;
    }

    // Handle meal card being dropped on a time slot (to change time)
    if (
      active.data.current?.type === 'meal-card' &&
      over.data.current?.type === 'time-slot'
    ) {
      const sourceDate = active.data.current.date;
      const sourceTime = active.data.current.time;
      const sourceMealIndex = active.data.current.mealIndex;
      const targetDate = over.data.current.date;
      const targetTime = over.data.current.time;
      
      // Don't move if dropping on the same time slot
      if (sourceDate === targetDate && sourceTime === targetTime) {
        setDraggedRecipe(null);
        return;
      }
      // Move the meal to a different time slot
      moveMealMutation.mutate({
        sourceDate,
        sourceTime,
        mealIndex: sourceMealIndex,
        targetDate,
        targetTime,
      });
      
      setDraggedRecipe(null);
      return;
    }

    // Handle meal card reordering within same time slot
    if (
      active.data.current?.type === 'meal-card' &&
      over.data.current?.type === 'meal-card' &&
      active.data.current?.date === over.data.current?.date &&
      active.data.current?.time === over.data.current?.time
    ) {
      const oldIndex = active.data.current.mealIndex;
      const newIndex = over.data.current.mealIndex;
      
      if (oldIndex !== newIndex) {
        reorderMealMutation.mutate({
          date: active.data.current.date,
          time: active.data.current.time,
          oldIndex,
          newIndex
        });
      }
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
        // Close sidebar when showing time picker
        setSidebarOpen(false);
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
  }, [addMealMutation, moveMealMutation, reorderMealMutation, setSidebarOpen, view]);

  const handleTimeSelect = React.useCallback((time: string) => {
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
      // Re-open sidebar after time selection on mobile
      if (isMobile) {
        setTimeout(() => setSidebarOpen(true), 300);
      }
    }
  }, [pendingMeal, addMealMutation, isMobile]);

  // Render current view
  const renderView = React.useCallback(() => {
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
        return <WeekView {...dayWeekProps} />;
      case "month":
        return <MonthView {...monthProps} />;
      default:
        return <WeekView {...dayWeekProps} />;
    }
  }, [view, currentDate, mealPlansData?.mealPlans, removeMealMutation, reorderMealMutation]);

  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <div className={styles.container}>
        {/* Mobile floating button */}
        <Button
          appearance="primary"
          icon={<PanelLeft24Regular />}
          className={styles.mobileFloatingButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ display: (draggedRecipe || showTimePicker) ? 'none' : undefined }}
        >
          Add
        </Button>
        
        {/* Mobile overlay */}
        {sidebarOpen && !draggedRecipe && (
          <div 
            className={styles.overlay} 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div 
          className={mergeClasses(
            styles.sidebar,
            sidebarOpen && !draggedRecipe && styles.sidebarOpen,
            draggedRecipe ? styles.sidebarNoTransition : undefined
          )}
          style={{ width: `${sidebarWidth}px` }}
        >
          <MealPlanSidebar />
          {/* Resizer handle */}
          <div 
            className={styles.sidebarResizer}
            onMouseDown={handleMouseDown}
          />
        </div>
        
        <div className={styles.main}>
          <CalendarToolbar
            view={view}
            currentDate={currentDate}
            onViewChange={setView}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
          />
          
          <div className={styles.calendarContent}>
            {renderView()}
          </div>
        </div>
      </div>
      
      <DragOverlay
        dropAnimation={null}
        modifiers={[snapCenterToCursor]}
        style={{
          cursor: 'grabbing',
        }}
      >
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