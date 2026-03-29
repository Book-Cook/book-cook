/**
 * Consolidated MealPlan types
 */
import type { MealItem } from "../../clientToServer/types";

export type CalendarView = 'day' | 'week' | 'month';

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

export type MealMovePayload = ApiPayload & {
  time: string;
  mealIndex: number;
  newTime: string;
};

export type MealReorderPayload = ApiPayload & {
  time: string;
  oldIndex: number;
  newIndex: number;
};

export type MealDragDropHandlers = {
  addMealMutation: {
    mutate: (payload: Record<string, unknown>) => void;
  };
  reorderMealMutation: {
    mutate: (payload: Record<string, unknown>) => void;
  };
  setPendingMeal: (meal: PendingMeal | null) => void;
  setShowTimePicker: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
};