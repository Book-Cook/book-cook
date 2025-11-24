export interface MealCardProps {
  id: string;
  recipeId: string;
  title: string;
  emoji?: string;
  time: string;
  duration: number;
  position: number;
  onRemove: () => void;
  date: string;
  mealIndex: number;
}
