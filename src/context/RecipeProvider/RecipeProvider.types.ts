export type RecipeContextType = {
  recipe: any;
  isLoading: boolean;
  error: unknown;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editableData: {
    title: string;
    content: string;
    tags: string[];
    imageURL: string;
  };
  updateEditableData: (field: string, value: any) => void;
  handleAddTag: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  saveChanges: () => void;
  cancelEditing: () => void;
  deleteRecipe: () => void;
  handleImageUpload: (file: File) => void;
};
