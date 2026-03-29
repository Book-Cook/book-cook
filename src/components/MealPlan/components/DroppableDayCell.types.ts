import type { MealPlanWithRecipes } from "../../../clientToServer/types";

export type DroppableDayCellProps = {
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  isPast: boolean;
  mealPlan: MealPlanWithRecipes | undefined;
  children?: React.ReactNode;
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
};