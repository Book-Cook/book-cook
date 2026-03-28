import type { Recipe } from "../../clientToServer/types";

export type RecipesCarouselProps = {
  /**
   * The list of recipes to be displayed in the carousel.
   */
  recipes: Array<Recipe & { isPast?: boolean }> | [];

  /**
   * The title of the carousel, displayed above the recipes.
   */
  title: string;

  /**
   * Boolean indicating if the carousel is loading.
   */
  isLoading: boolean;

  /**
   * Optional initial scroll index to position the carousel at startup
   */
  initialScrollIndex?: number;
};
