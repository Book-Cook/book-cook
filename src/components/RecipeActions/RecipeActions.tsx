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
import isEqual from "lodash/isEqual";
import dynamic from "next/dynamic";

import type { RecipeActionsProps } from "./RecipeActions.types";

import { useRecipe } from "../../context";

type DialogType = "title" | "tags" | "emoji" | null;

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

export const RecipeActions: React.FC<RecipeActionsProps> = (props) => {
  const { _id, title, tags, emoji, imageURL } = props;
  const { editableData, saveChanges, deleteRecipe, updateEditableData } =
    useRecipe();

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
        content: "",
      };

      if (_id && !isEqual(editableData, newData)) {
        updateEditableData(newData);
      }
    },
    [_id, editableData, title, tags, emoji, imageURL, updateEditableData]
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
        <MenuItem icon={<TagRegular />} onClick={openDialog("tags")}>
          Add Tags
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<DeleteRegular />} onClick={handleDeleteClick}>
          Delete recipe
        </MenuItem>
      </MenuList>
    ),
    [openDialog, handleDeleteClick]
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
    </>
  );
};
