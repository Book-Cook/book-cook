import * as React from "react";

import { useToggleRecipeVisibility } from "../../clientToServer/post/useToggleRecipeVisibility";
import type { EditableData } from "../../context";
import { useRecipe } from "../../context";
import { isEqual } from "../../utils/isEqual";

type DialogType = "title" | "tags" | "emoji" | "isPublic" | null;

interface UseRecipeActionsProps {
  _id?: string;
  title?: string;
  tags?: string[];
  emoji?: string;
  imageURL?: string;
  isPublic?: boolean;
}

interface UseRecipeActionsReturn {
  activeDialog: DialogType;
  setActiveDialog: React.Dispatch<React.SetStateAction<DialogType>>;
  handleMenuInteraction: (e: React.MouseEvent) => void;
  closeDialog: () => void;
  handleSave: (field: keyof EditableData) => (value: string | string[]) => void;
  handleVisibilitySave: (value: string) => void;
  editableData: EditableData;
  isTogglingVisibility: boolean;
}

/**
 * Encapsulates dialog state and action callbacks for recipe actions menu.
 */
export function useRecipeActions({
  _id: propId,
  title: propTitle,
  tags: propTags,
  emoji: propEmoji,
  imageURL: propImageURL,
  isPublic: propIsPublic,
}: UseRecipeActionsProps): UseRecipeActionsReturn {
  const { editableData, saveChanges, updateEditableData } = useRecipe();
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } =
    useToggleRecipeVisibility();

  const _id = propId ?? editableData?._id;
  const title = propTitle ?? editableData?.title;
  const tags = propTags ?? editableData?.tags;
  const emoji = propEmoji ?? editableData?.emoji;
  const imageURL = propImageURL ?? editableData?.imageURL;
  const isPublic = propIsPublic ?? editableData?.isPublic;

  const [activeDialog, setActiveDialog] = React.useState<DialogType>(null);

  const handleMenuInteraction = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      const newData = {
        ...editableData,
        _id,
        title: title ?? editableData?.title ?? "",
        tags: tags ?? editableData?.tags ?? [],
        emoji: emoji ?? editableData?.emoji ?? "",
        imageURL: imageURL ?? editableData?.imageURL ?? "",
        isPublic: isPublic ?? editableData?.isPublic ?? false,
      };

      if (_id && !isEqual(editableData, newData)) {
        updateEditableData(newData);
      }
    },
    [
      _id,
      title,
      tags,
      emoji,
      imageURL,
      isPublic,
      editableData,
      updateEditableData,
    ],
  );

  const closeDialog = React.useCallback(() => {
    setActiveDialog(null);
  }, []);

  const handleSave = React.useCallback(
    (field: keyof EditableData) => (value: string | string[]) => {
      saveChanges({ [field]: value });
      closeDialog();
    },
    [saveChanges, closeDialog],
  );

  const handleVisibilitySave = React.useCallback(
    (value: string) => {
      const newIsPublic = value === "true";

      if (!editableData._id) {
        console.error("No recipe ID found in editableData:", editableData);
        alert(
          "Unable to update recipe visibility: Recipe ID not found. Please refresh the page and try again.",
        );
        return;
      }

      toggleVisibility(
        { recipeId: editableData._id, isPublic: newIsPublic },
        {
          onSuccess: () => {
            saveChanges({ isPublic: newIsPublic });
            closeDialog();
          },
          onError: (error) => {
            console.error("Failed to update recipe visibility:", error);
            let errorMessage =
              "Failed to update recipe visibility. Please check your internet connection and try again.";

            if (error instanceof Error) {
              if (
                error.message.includes("not found") ||
                error.message.includes("permission")
              ) {
                errorMessage =
                  "You don't have permission to modify this recipe, or it no longer exists.";
              } else if (
                error.message.includes("network") ||
                error.message.includes("fetch")
              ) {
                errorMessage =
                  "Network error. Please check your internet connection and try again.";
              }
            }

            alert(errorMessage);
          },
        },
      );
    },
    [editableData, toggleVisibility, saveChanges, closeDialog],
  );

  return {
    activeDialog,
    setActiveDialog,
    handleMenuInteraction,
    closeDialog,
    handleSave,
    handleVisibilitySave,
    editableData,
    isTogglingVisibility,
  };
}
