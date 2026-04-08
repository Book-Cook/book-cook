import React from "react";

import type { EditableData, RecipeContextValue } from "./RecipeProvider.types";

const defaultEditableData: EditableData = {
  title: "",
  content: "",
  tags: [],
  imageURL: "",
  emoji: "",
  isPublic: false,
  _id: undefined,
};

const defaultContextValue: RecipeContextValue = {
  recipe: null,
  isLoading: false,
  isAuthorized: true,
  error: null,
  editableData: defaultEditableData,
  updateEditableData: () => {},
  handleAddTag: () => {},
  handleRemoveTag: () => {},
  saveChanges: () => {},
  cancelEditing: () => {},
  deleteRecipe: () => {},
  onAddToCollection: undefined,
  onSaveRecipe: undefined,
  hasEdits: false,
};

export const RecipeContext =
  React.createContext<RecipeContextValue>(defaultContextValue);

export const useRecipe = (): RecipeContextValue =>
  React.useContext(RecipeContext);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [editableData, setEditableData] =
    React.useState<EditableData>(defaultEditableData);

  const updateEditableData = React.useCallback((data: EditableData) => {
    setEditableData(data);
  }, []);

  const handleAddTag = React.useCallback((tag: string) => {
    setEditableData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag],
    }));
  }, []);

  const handleRemoveTag = React.useCallback((tag: string) => {
    setEditableData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const contextValue = React.useMemo<RecipeContextValue>(
    () => ({
      ...defaultContextValue,
      editableData,
      updateEditableData,
      handleAddTag,
      handleRemoveTag,
    }),
    [editableData, updateEditableData, handleAddTag, handleRemoveTag],
  );

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
};
