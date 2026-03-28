import type { EmblaOptionsType } from "embla-carousel";

import type { Recipe } from "../RecipeView/RecipeView.types";

export type RecipeCardCarouselProps = {
  title?: string;
  recipes: Recipe[];
  onRecipeClick?: (recipe: Recipe) => void;
  className?: string;
  cardClassName?: string;
  showMeta?: boolean;
  ariaLabel?: string;
  emblaOptions?: EmblaOptionsType;
  isLoading?: boolean;
  initialScrollIndex?: number;
};
