// Types for meal plan calendar components

export type CalendarView = "day" | "week" | "month";

export interface MealPlanCalendarProps {
  initialView?: CalendarView;
}

export interface DraggedRecipe {
  id: string;
  title: string;
  emoji: string;
}

export interface DropTarget {
  date: string;
  time?: string; // For new time-based system
  mealType?: "breakfast" | "lunch" | "dinner" | "snack"; // Legacy support
  type?: "timeSlot" | "mealSlot";
}