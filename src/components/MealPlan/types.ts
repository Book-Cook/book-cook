/**
 * Consolidated MealPlan types
 */
import type { CreateMealPlanPayload, MealItem } from "../../clientToServer/types";

export type CalendarView = "day" | "week" | "month";

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type TimeSlot = {
  time: string;
  meals: Array<MealItem & { recipe?: Record<string, unknown> }>;
};

export type DraggedRecipe = {
  id: string;
  title: string;
  emoji?: string;
};

export type PendingMeal = {
  recipe: DraggedRecipe;
  date: string;
};

export type FlattenedMeal = {
  id: string;
  meal: MealItem & { recipe?: Record<string, unknown> };
  time: string;
  index: number;
};

export type OptimisticUpdateContext = {
  dateRange: DateRange;
};

export type ApiPayload = Record<string, unknown> & {
  date: string;
};

export type MealMovePayload = {
  sourceDate: string;
  sourceTime: string;
  mealIndex: number;
  targetDate: string;
  targetTime: string;
};

export type MealReorderPayload = ApiPayload & {
  time: string;
  oldIndex: number;
  newIndex: number;
};

export type MealDragDropHandlers = {
  addMealMutation: {
    mutate: (payload: CreateMealPlanPayload) => void;
  };
  reorderMealMutation: {
    mutate: (payload: MealReorderPayload) => void;
  };
  moveMealMutation: {
    mutate: (payload: MealMovePayload) => void;
  };
  setPendingMeal: (meal: PendingMeal | null) => void;
  setShowTimePicker: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
};
