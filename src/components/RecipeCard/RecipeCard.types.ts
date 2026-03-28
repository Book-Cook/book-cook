import type { Recipe } from "../RecipeView/RecipeView.types";

export type RecipeCardProps = {
  /**
   * Recipe data to display. Not required when isLoading is true.
   */
  recipe?: Recipe;
  /**
   * Optional click handler for interactive cards.
   */
  onClick?: (recipe: Recipe) => void;
  /**
   * Optional class names to customize the card.
   */
  className?: string;
  /**
   * Show the author and created date row.
   * @default true
   */
  showMeta?: boolean;
  /**
   * Render the card as an animated skeleton placeholder.
   * @default false
   */
  isLoading?: boolean;
};
