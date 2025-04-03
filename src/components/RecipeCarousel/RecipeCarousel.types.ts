import type { Recipe } from "../../clientToServer/types";

export type RecipesCarouselProps = {
  /**
   * The list of recipes to be displayed in the carousel.
   */
  recipes: Recipe[] | [];

  /**
   * The title of the carousel, displayed above the recipes.
   */
  title: string;
};
