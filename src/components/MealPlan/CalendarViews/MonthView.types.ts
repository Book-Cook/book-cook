import type { MealPlanWithRecipes } from "../../../clientToServer/types";

export type MonthViewProps = {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
};