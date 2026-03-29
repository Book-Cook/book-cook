import * as React from "react";
import {
  TrashIcon,
  DotsThreeIcon,
  TagIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import isEqual from "fast-deep-equal";
import dynamic from "next/dynamic";

import { useFetchAllTags } from "src/clientToServer";
import type { RecipeActionsProps } from "./RecipeActions.types";
import { Button } from "../Button";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "../Menu";
import { Tooltip } from "../Tooltip";

import { useToggleRecipeVisibility } from "../../clientToServer/post/useToggleRecipeVisibility";
import { useRecipe } from "../../context";

type DialogType = "title" | "tags" | "emoji" | "isPublic" | null;

const ChangeTitleDialog = dynamic(() => import("./ChangeTitleDialog"), {
  loading: () => null,
  ssr: false,
});

const ChangeTagsDialog = dynamic(() => import("./ChangeTagsDialog"), {
  loading: () => null,
  ssr: false,
});

const ChangeEmojiDialog = dynamic(() => import("./ChangeEmojiDialog"), {
  loading: () => null,
  ssr: false,
});

const ChangeSharedWithDialog = dynamic(
  () => import("./ChangeSharedWithDialog"),
  {
    loading: () => null,
    ssr: false,
  }
);

export const RecipeActions: React.FC<RecipeActionsProps> = (props) => {
  const { editableData, saveChanges, deleteRecipe, updateEditableData } =
    useRecipe();

  // Use props if provided, otherwise fall back to editableData from context
  const _id = props._id ?? editableData?._id;
  const title = props.title ?? editableData?.title;
  const tags = props.tags ?? editableData?.tags;
  const emoji = props.emoji ?? editableData?.emoji;
  const imageURL = props.imageURL ?? editableData?.imageURL;
  const isPublic = props.isPublic ?? editableData?.isPublic;
  const { availableTags } = useFetchAllTags();
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } =
    useToggleRecipeVisibility();

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
    ]
  );

  const closeDialog = React.useCallback(() => {
    setActiveDialog(null);
  }, []);

  const handleSave = React.useCallback(
    (field: keyof typeof editableData) => (value: string | string[]) => {
      saveChanges({ [field]: value });
      closeDialog();
    },
    [saveChanges, closeDialog]
  );

  const handleVisibilitySave = React.useCallback(
    (value: string) => {
      const isPublic = value === "true";

      if (!editableData._id) {
        console.error("No recipe ID found in editableData:", editableData);
        alert(
          "Unable to update recipe visibility: Recipe ID not found. Please refresh the page and try again."
        );
        return;
      }

      toggleVisibility(
        { recipeId: editableData._id, isPublic },
        {
          onSuccess: () => {
            // Update local state to reflect the change
            saveChanges({ isPublic });
            closeDialog();
          },
          onError: (error) => {
            console.error("Failed to update recipe visibility:", error);
            // Keep dialog open on error so user can retry
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
        }
      );
    },
    [editableData, toggleVisibility, saveChanges, closeDialog]
  );

  return (
    <>
      <Menu>
        <MenuTrigger asChild>
          <Tooltip content="More options">
            <Button
              aria-label="More options"
              variant="ghost"
              icon={<DotsThreeIcon />}
              shape="square"
              onClick={handleMenuInteraction}
            />
          </Tooltip>
        </MenuTrigger>
        <MenuContent onClick={(ev) => ev.stopPropagation()}>
          <MenuItem
            startIcon={<UsersIcon />}
            onSelect={() => { setActiveDialog("isPublic"); }}
          >
            Visibility
          </MenuItem>
          <MenuItem
            startIcon={<TagIcon />}
            onSelect={() => { setActiveDialog("tags"); }}
          >
            Add Tags
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            startIcon={<TrashIcon />}
            onSelect={() => deleteRecipe()}
          >
            Delete Recipe
          </MenuItem>
        </MenuContent>
      </Menu>
      {activeDialog === "title" && (
        <ChangeTitleDialog
          isOpen={activeDialog === "title"}
          currentTitle={editableData.title}
          onSave={handleSave("title")}
          onClose={closeDialog}
        />
      )}
      {activeDialog === "tags" && (
        <ChangeTagsDialog
          isOpen={activeDialog === "tags"}
          currentTags={editableData.tags}
          onSave={handleSave("tags")}
          availableTags={availableTags}
          onClose={closeDialog}
        />
      )}
      {activeDialog === "emoji" && (
        <ChangeEmojiDialog
          isOpen={activeDialog === "emoji"}
          currentEmoji={editableData.emoji}
          onSave={handleSave("emoji")}
          onClose={closeDialog}
        />
      )}
      {activeDialog === "isPublic" && (
        <ChangeSharedWithDialog
          isOpen={activeDialog === "isPublic"}
          isPublic={isPublic ?? false}
          onSave={handleVisibilitySave}
          onClose={closeDialog}
          isLoading={isTogglingVisibility}
        />
      )}
    </>
  );
};
