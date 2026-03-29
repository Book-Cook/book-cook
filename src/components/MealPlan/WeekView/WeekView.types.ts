import type { MealPlanWithRecipes } from "../../../clientToServer/types";

export type WeekViewProps = {
  currentDate: Date;
  mealPlans: MealPlanWithRecipes[];
  onMealRemove: (date: string, time: string, mealIndex: number) => Promise<void>;
};