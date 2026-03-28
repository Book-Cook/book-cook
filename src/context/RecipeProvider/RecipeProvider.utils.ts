import isEqual from "fast-deep-equal";

import type { EditableData } from "./RecipeProvider.types";

import type { Recipe, UpdateRecipePayload } from "../../clientToServer";

export const toEditableData = (recipe?: Recipe | null): EditableData => ({
  title: recipe?.title ?? "",
  content: recipe?.data ?? "",
  tags: recipe?.tags ?? [],
  imageURL: recipe?.imageURL ?? "",
  emoji: recipe?.emoji ?? "",
  isPublic: recipe?.isPublic ?? false,
  _id: recipe?._id,
});

export const hasPendingEdits = (
  current: EditableData,
  snapshot: EditableData | null
): boolean => {
  if (!snapshot) {
    return false;
  }
  return !isEqual(current, snapshot);
};

export const buildUpdatePayload = (
  editableData: EditableData,
  immediateUpdate?: Partial<UpdateRecipePayload>
): UpdateRecipePayload => ({
  title: editableData.title,
  data: editableData.content,
  tags: editableData.tags,
  imageURL: editableData.imageURL,
  emoji: editableData.emoji ?? "",
  isPublic: editableData.isPublic ?? false,
  ...(immediateUpdate ?? {}),
});
