import { Recipe } from "src/clientToServer";

export type RecipeContextType = {
  recipe: Recipe | undefined;
  isLoading: boolean;
  error: unknown;
  hasEdits: boolean;
  editableData: {
    title: string;
    content: string;
    tags: string[];
    imageURL: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEditableData: (field: string, value: any) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  saveChanges: () => void;
  cancelEditing: () => void;
  deleteRecipe: () => void;
  onAddToCollection: (recipeId: string) => Promise<void>;
};
