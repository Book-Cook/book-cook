export type RecipeTagsProps = {
  tags: string[];
  onTagClick?: (tag: string) => void;
  onTagsChange?: (tags: string[]) => void;
  editable?: boolean;
};
