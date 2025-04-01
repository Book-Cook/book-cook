import type { Recipe } from "../../clientToServer/types";

export type RecentRecipesCarouselProps = {
  recipes: Recipe[] | [];
  title?: string;
};
