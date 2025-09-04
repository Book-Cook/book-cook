import type { MealItem } from "../../../clientToServer/types";

export type TimeSlotProps = {
  date: string;
  time: string; // "HH:mm" format
  meals: (MealItem & { recipe?: Record<string, unknown> })[];
  onRemoveMeal: (mealIndex: number) => void;
  showTimeLabel?: boolean;
};