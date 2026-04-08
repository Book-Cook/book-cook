import * as React from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";

import styles from "./MealPlanCalendar.module.css";
import type { MealPlanCalendarProps } from "./MealPlanCalendar.types";
import { CalendarToolbar } from "../CalendarToolbar/CalendarToolbar";
import { HourlyDayView } from "../CalendarViews/HourlyDayView";
import { MonthView } from "../CalendarViews/MonthView";
import { useCalendarNavigation } from "../hooks/useCalendarNavigation";
import { useMealDragDrop } from "../hooks/useMealDragDrop";
import { useMealPlanData } from "../hooks/useMealPlanData";
import { useMealPlanMutations } from "../hooks/useMealPlanMutations";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { MealPlanSidebar } from "../MealPlanSidebar/MealPlanSidebar";
import { RecipeDragCard } from "../RecipeDragCard/RecipeDragCard";
import { TimePicker } from "../TimePicker/TimePicker";
import type { PendingMeal } from "../types";
import WeekView from "../WeekView";

import type { CreateMealPlanPayload } from "../../../clientToServer/types";
import { Button } from "../../Button";

export const MealPlanCalendar: React.FC<MealPlanCalendarProps> = ({
  initialView = "week",
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [pendingMeal, setPendingMeal] = React.useState<PendingMeal | null>(null);

  const { sidebarWidth, isMobile, handleMouseDown } = useSidebarResize();

  const {
    currentDate,
    view,
    setView,
    handlePrevious,
    handleNext,
    handleToday,
    dateRange,
  } = useCalendarNavigation(new Date(), initialView);

  const { mealPlansData } = useMealPlanData({ view, currentDate });

  const { addMealMutation, removeMealMutation, reorderMealMutation, moveMealMutation } =
    useMealPlanMutations({ dateRange });

  const { draggedRecipe, handleDragStart, handleDragEnd } = useMealDragDrop(
    {
      addMealMutation,
      reorderMealMutation,
      moveMealMutation,
      setPendingMeal,
      setShowTimePicker,
      setSidebarOpen,
    },
    view,
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (isMobile && !e.matches && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [isMobile, sidebarOpen]);

  const handleTimeSelect = React.useCallback(
    (time: string) => {
      if (pendingMeal) {
        const payload: CreateMealPlanPayload = {
          date: pendingMeal.date,
          recipeId: pendingMeal.recipe.id,
          servings: 1,
          time,
          duration: 60,
        };
        addMealMutation.mutate(payload);
        setPendingMeal(null);
        if (isMobile) {
          setTimeout(() => setSidebarOpen(true), 300);
        }
      }
    },
    [pendingMeal, addMealMutation, isMobile],
  );

  const renderView = React.useCallback(() => {
    const onMealRemove = async (
      date: string,
      time: string,
      mealIndex: number,
    ): Promise<void> =>
      new Promise<void>((resolve) => {
        removeMealMutation.mutate({ date, time, mealIndex });
        resolve();
      });

    const viewProps = {
      currentDate,
      mealPlans: mealPlansData?.mealPlans ?? [],
      onMealRemove,
    };

    switch (view) {
      case "day":
        return <HourlyDayView {...viewProps} />;
      case "week":
        return <WeekView {...viewProps} />;
      case "month":
        return <MonthView {...viewProps} />;
      default:
        return <WeekView {...viewProps} />;
    }
  }, [view, currentDate, mealPlansData?.mealPlans, removeMealMutation]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <div className={styles.container}>
        <Button
          appearance="primary"
          startIcon={<SidebarSimpleIcon size={16} />}
          className={styles.mobileFloatingButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: draggedRecipe || showTimePicker ? "none" : undefined,
          }}
        >
          Add
        </Button>

        {sidebarOpen && !draggedRecipe && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={clsx(
            styles.sidebar,
            sidebarOpen && !draggedRecipe && styles.sidebarOpen,
            draggedRecipe ? styles.sidebarNoTransition : undefined,
          )}
          style={{ width: `${sidebarWidth}px` }}
        >
          <MealPlanSidebar />
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
          <div className={styles.calendarContent}>{renderView()}</div>
        </div>
      </div>

      <DragOverlay
        dropAnimation={null}
        modifiers={[snapCenterToCursor]}
        style={{ cursor: "grabbing" }}
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
