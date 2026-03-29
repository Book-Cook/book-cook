import type { RecipeViewProps } from "../RecipeView.types";

export type RecipeHeaderProps = {
  recipe: RecipeViewProps["recipe"];
  viewingMode: NonNullable<RecipeViewProps["viewingMode"]>;
  onTagClick?: (tag: string) => void;
  onTagsChange?: (tags: string[]) => void;
  onEdit?: () => void;
};
