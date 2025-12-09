import type { Recipe, UpdateRecipePayload } from "../../clientToServer";

export type EditableData = {
  title: string;
  content: string;
  tags: string[];
  imageURL: string;
  emoji: string;
  _id?: string;
  isPublic?: boolean;
};

export type RecipeContextType = {
  recipe: Recipe | undefined;
  isAuthorized: boolean;
  isLoading: boolean;
  error: unknown;
  hasEdits: boolean;
  editableData: EditableData;
  updateEditableData: (patch: Partial<EditableData>) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  saveChanges: (immediateUpdate?: Partial<UpdateRecipePayload>) => void;
  cancelEditing: () => void;
  deleteRecipe: () => void;
  onAddToCollection: (recipeId: string) => void;
  onSaveRecipe: (recipeId: string) => void;
};
