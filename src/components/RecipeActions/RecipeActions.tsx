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
import { useRecipe } from "../../context";
import type { RecipeActionsProps } from "./RecipeActions.types";
import isEqual from "lodash/isEqual";

type DialogType = "title" | "tags" | "emoji" | null;

const ChangeTitleDialog = React.lazy(() =>
  import("./ChangeTitleDialog").then((mod) => ({
    default: mod.ChangeTitleDialog,
  }))
);
const ChangeTagsDialog = React.lazy(() =>
  import("./ChangeTagsDialog").then((mod) => ({
    default: mod.ChangeTagsDialog,
  }))
);
const ChangeEmojiDialog = React.lazy(() =>
  import("./ChangeEmojiDialog").then((mod) => ({
    default: mod.ChangeEmojiDialog,
  }))
);

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
        _id: _id,
        title: title || "",
        tags: tags || [],
        emoji: emoji || "",
        imageURL: imageURL || "",
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
        <React.Suspense fallback={null}>
          <ChangeTitleDialog
            isOpen={activeDialog === "title"}
            currentTitle={editableData.title}
            onSave={handleSave("title")}
            onClose={closeDialog}
          />
        </React.Suspense>
      )}
      {activeDialog === "tags" && (
        <React.Suspense fallback={null}>
          <ChangeTagsDialog
            isOpen={activeDialog === "tags"}
            currentTags={editableData.tags}
            onSave={handleSave("tags")}
            onClose={closeDialog}
          />
        </React.Suspense>
      )}
      {activeDialog === "emoji" && (
        <React.Suspense fallback={null}>
          <ChangeEmojiDialog
            isOpen={activeDialog === "emoji"}
            currentEmoji={editableData?.emoji}
            onSave={handleSave("emoji")}
            onClose={closeDialog}
          />
        </React.Suspense>
      )}
    </>
  );
};
