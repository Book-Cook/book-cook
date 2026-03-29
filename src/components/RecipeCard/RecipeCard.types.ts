import type { Recipe } from "../../clientToServer/types/recipes.types";

export type RecipeCardProps = {
  /**
   * The recipe data to render.
   */
  recipe?: Recipe | null;

  /**
   * Callback when the card is clicked. Receives the recipe object.
   */
  onClick?: (recipe: Recipe) => void;

  /**
   * Optional className to add to the card root.
   */
  className?: string;

  /**
   * Whether to show meta information (date, tags, creator).
   * @default true
   */
  showMeta?: boolean;

  /**
   * Whether the card is in a loading skeleton state.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether to show the actions (more options) button.
   * @default true
   */
  showActions?: boolean;

  /**
   * Minimal display mode — hides the actions button.
   * @default false
   */
  isMinimal?: boolean;
};
