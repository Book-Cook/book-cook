export type RecipeContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recipe: any;
  isLoading: boolean;
  error: unknown;
  isEditing: boolean;
  hasEdits: boolean;
  setIsEditing: (value: boolean) => void;
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
  handleImageUpload: (file: File) => void;
  addToCollection: (recipeId: string) => Promise<void>;
};
