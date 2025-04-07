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
} from "@fluentui/react-icons";
import { ChangeTitleDialog } from "./ChangeTitleDialog";
import { ChangeTagsDialog } from "./ChangeTagsDialog";
import { ChangeEmojiDialog } from "./ChangeEmojiDialog";
import { useRecipe } from "../../context";
import type { RecipeActionsProps } from "./RecipeActions.types";
import { isEqual } from "lodash";

export const RecipeActions: React.FC<RecipeActionsProps> = (props) => {
  const { _id, title, tags, emoji, imageURL } = props;

  const { editableData, saveChanges, deleteRecipe, updateEditableData } =
    useRecipe();

  const [isTitleDialogOpen, setIsTitleDialogOpen] = React.useState(false);
  const [isTagsDialogOpen, setIsTagsDialogOpen] = React.useState(false);
  const [isEmojiDialogOpen, setIsEmojiDialogOpen] = React.useState(false);

  const handleMenuInteraction = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();

      const newData = {
        _id: _id,
        title: title || "",
        tags: tags || [],
        emoji: emoji || "",
        imageURL: imageURL || "",
        content: "",
      };

      // Check if the editableData has changed before updating
      if (_id && !isEqual(editableData, newData)) {
        updateEditableData(newData);
      }
    },
    [_id, editableData, title, tags, emoji, imageURL, updateEditableData]
  );

  // Click handlers with proper event stopping
  const openTitleDialog = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTitleDialogOpen(true);
  }, []);

  const openEmojiDialog = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEmojiDialogOpen(true);
  }, []);

  const openTagsDialog = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTagsDialogOpen(true);
  }, []);

  // Dialog close handlers
  const closeTitleDialog = React.useCallback(() => {
    setIsTitleDialogOpen(false);
  }, []);

  const closeTagsDialog = React.useCallback(() => {
    setIsTagsDialogOpen(false);
  }, []);

  const closeEmojiDialog = React.useCallback(() => {
    setIsEmojiDialogOpen(false);
  }, []);

  // Dialog save handlers
  const handleTitleDialogSave = React.useCallback(
    (newTitle: string) => {
      saveChanges({ title: newTitle });
      setIsTitleDialogOpen(false);
    },
    [saveChanges]
  );

  const handleTagsDialogSave = React.useCallback(
    (updatedTags: string[]) => {
      saveChanges({ tags: updatedTags });
      setIsTagsDialogOpen(false);
    },
    [saveChanges]
  );

  const handleEmojiDialogSave = React.useCallback(
    (updatedEmoji: string) => {
      saveChanges({ emoji: updatedEmoji });
      setIsEmojiDialogOpen(false);
    },
    [saveChanges]
  );

  const handleDeleteClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteRecipe();
    },
    [deleteRecipe]
  );

  // Memoize menu content to prevent re-renders
  const menuContent = React.useMemo(
    () => (
      <MenuList onClick={(ev) => ev.stopPropagation()}>
        <MenuItem icon={<EditRegular />} onClick={openTitleDialog}>
          Change Title
        </MenuItem>
        <MenuItem icon={<EmojiRegular />} onClick={openEmojiDialog}>
          Change Emoji
        </MenuItem>
        <MenuItem icon={<TagRegular />} onClick={openTagsDialog}>
          Add Tags
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<DeleteRegular />} onClick={handleDeleteClick}>
          Delete recipe
        </MenuItem>
      </MenuList>
    ),
    [openTitleDialog, openEmojiDialog, openTagsDialog, handleDeleteClick]
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
      <ChangeTitleDialog
        isOpen={isTitleDialogOpen}
        currentTitle={editableData.title}
        onSave={handleTitleDialogSave}
        onClose={closeTitleDialog}
      />
      <ChangeTagsDialog
        isOpen={isTagsDialogOpen}
        currentTags={editableData.tags}
        onSave={handleTagsDialogSave}
        onClose={closeTagsDialog}
      />
      <ChangeEmojiDialog
        isOpen={isEmojiDialogOpen}
        currentEmoji={editableData?.emoji}
        onSave={handleEmojiDialogSave}
        onClose={closeEmojiDialog}
      />
    </>
  );
};
