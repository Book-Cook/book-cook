import type { Recipe } from "../RecipeView/RecipeView.types";

export type RecipeCardGalleryProps = {
  title?: string;
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  className?: string;
  cardClassName?: string;
  showMeta?: boolean;
  ariaLabel?: string;
  isLoading?: boolean;
  skeletonCount?: number;
};
