import type { Recipe } from "../../clientToServer/types";

export type EditableData = {
  title: string;
  content: string;
  tags: string[];
  imageURL: string;
  emoji: string;
  isPublic: boolean;
  _id?: string;
};

export type RecipeContextValue = {
  recipe: Recipe | null;
  isLoading: boolean;
  isAuthorized: boolean;
  error: unknown;
  editableData: EditableData;
  updateEditableData: (data: EditableData) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  saveChanges: (patch?: Partial<EditableData>) => void;
  cancelEditing: () => void;
  deleteRecipe: () => void;
  onAddToCollection?: () => void;
  onSaveRecipe?: () => void;
  hasEdits: boolean;
};
