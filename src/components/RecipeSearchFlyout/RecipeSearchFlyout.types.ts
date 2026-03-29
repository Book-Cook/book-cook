import type { Recipe } from "../RecipeView/RecipeView.types";

export type RecipeSearchFlyoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recentRecipes: Recipe[];
};
