import * as React from "react";
import {
  Button,
  Tooltip,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  MenuDivider,
} from "@fluentui/react-components";
import {
  DeleteRegular,
  MoreHorizontalRegular,
  EditRegular,
  TagRegular,
  EmojiRegular,
  PeopleTeamRegular,
} from "@fluentui/react-icons";
import isEqual from "fast-deep-equal";
import dynamic from "next/dynamic";

import { useFetchAllTags } from "src/clientToServer";
import type { RecipeActionsProps } from "./RecipeActions.types";

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
  const { mutate: toggleVisibility } = useToggleRecipeVisibility();

  const [activeDialog, setActiveDialog] = React.useState<DialogType>(null);

  const handleMenuInteraction = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      const newData = {
        _id,
        title: title ?? "",
        tags: tags ?? [],
        emoji: emoji ?? "",
        imageURL: imageURL ?? "",
        isPublic: isPublic ?? false,
        content: "",
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

  const openDialog = React.useCallback(
    (type: DialogType) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveDialog(type);
    },
    []
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
      console.log("Toggling visibility:", { recipeId: editableData._id, isPublic, value });
      
      if (!editableData._id) {
        console.error("No recipe ID found in editableData:", editableData);
        return;
      }

      toggleVisibility(
        { recipeId: editableData._id, isPublic },
        {
          onSuccess: (data) => {
            console.log("Visibility toggle success:", data);
            // Update local state to reflect the change
            saveChanges({ isPublic });
            closeDialog();
          },
          onError: (error) => {
            console.error("Failed to update recipe visibility:", error);
            // Keep dialog open on error so user can retry
          },
        }
      );
    },
    [editableData._id, toggleVisibility, saveChanges, closeDialog]
  );

  const handleDeleteClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteRecipe();
    },
    [deleteRecipe]
  );

  const menuContent = React.useMemo(
    () => (
      <MenuList onClick={(ev) => ev.stopPropagation()}>
        <MenuItem icon={<EditRegular />} onClick={openDialog("title")}>
          Change Title
        </MenuItem>
        <MenuItem icon={<EmojiRegular />} onClick={openDialog("emoji")}>
          Change Emoji
        </MenuItem>
        <MenuItem icon={<PeopleTeamRegular />} onClick={openDialog("isPublic")}>
          Visibility
        </MenuItem>
        <MenuItem icon={<TagRegular />} onClick={openDialog("tags")}>
          Add Tags
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<DeleteRegular />} onClick={handleDeleteClick}>
          Delete Recipe
        </MenuItem>
      </MenuList>
    ),
    [openDialog, handleDeleteClick, isPublic]
  );

  return (
    <>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Tooltip content="More options" relationship="label">
            <Button
              aria-label="More options"
              appearance="subtle"
              icon={<MoreHorizontalRegular />}
              shape="circular"
              onClick={handleMenuInteraction}
            />
          </Tooltip>
        </MenuTrigger>
        <MenuPopover>{menuContent}</MenuPopover>
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
        />
      )}
    </>
  );
};
