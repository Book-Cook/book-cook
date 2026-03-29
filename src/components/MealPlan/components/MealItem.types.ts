import type { MealItem as MealItemType } from "../../../clientToServer/types";

export type MealItemProps = {
  meal: MealItemType & { recipe?: Record<string, unknown> };
  mealIndex: number;
  onRemove: (mealIndex: number) => void;
};