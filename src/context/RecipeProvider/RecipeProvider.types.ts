import type { Recipe, UpdateRecipePayload } from "../../clientToServer";

export type EditableData = {
  title: string;
  content: string;
  tags: string[];
  imageURL: string;
  emoji: string;
  _id?: string;
};

export type RecipeContextType = {
  recipe: Recipe | undefined;
  isLoading: boolean;
  error: unknown;
  hasEdits: boolean;
  editableData: EditableData;
  updateEditableData: (value: EditableData) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEditableDataKey: (field: string, value: any) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  saveChanges: (immediateUpdate?: Partial<UpdateRecipePayload>) => void;
  cancelEditing: () => void;
  deleteRecipe: () => void;
  onAddToCollection: (recipeId: string) => Promise<void>;
};
