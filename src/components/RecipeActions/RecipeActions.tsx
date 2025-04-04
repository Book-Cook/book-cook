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

export const RecipeActions: React.FC<RecipeActionsProps> = (props) => {
  const { _id, title, tags, emoji, imageURL } = props;

  const { editableData, saveChanges, deleteRecipe, updateEditableData } =
    useRecipe();

  const [isTitleDialogOpen, setIsTitleDialogOpen] = React.useState(false);
  const [isTagsDialogOpen, setIsTagsDialogOpen] = React.useState(false);
  const [isEmojiDialogOpen, setIsEmojiDialogOpen] = React.useState(false);

  const handleTitleDialogSave = (newTitle: string) => {
    saveChanges({ title: newTitle });
    setIsTitleDialogOpen(false);
  };

  const handleTagsDialogSave = (updatedTags: string[]) => {
    saveChanges({ tags: updatedTags });
    setIsTagsDialogOpen(false);
  };

  const handleEmojiDialogSave = (updatedEmoji: string) => {
    saveChanges({ emoji: updatedEmoji });
    setIsEmojiDialogOpen(false);
  };

  const handleMenuInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (_id) {
      updateEditableData({
        _id: _id,
        title: title || "",
        tags: tags || [],
        emoji: emoji || "",
        imageURL: imageURL || "",
        content: "",
      });
    }
  };

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
        <MenuPopover>
          <MenuList onClick={(ev) => ev.stopPropagation()}>
            <MenuItem
              icon={<EditRegular />}
              onClick={() => {
                setIsTitleDialogOpen(true);
              }}
            >
              Change Title
            </MenuItem>
            <MenuItem
              icon={<EmojiRegular />}
              onClick={(ev) => {
                ev.stopPropagation();
                setIsEmojiDialogOpen(true);
              }}
            >
              Change Emoji
            </MenuItem>
            <MenuItem
              icon={<TagRegular />}
              onClick={(ev) => {
                ev.stopPropagation();
                setIsTagsDialogOpen(true);
              }}
            >
              Add Tags
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<DeleteRegular />}
              onClick={(ev) => {
                ev.stopPropagation();
                deleteRecipe();
              }}
            >
              Delete recipe
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <ChangeTitleDialog
        isOpen={isTitleDialogOpen}
        currentTitle={editableData.title}
        onSave={handleTitleDialogSave}
        onClose={() => {
          setIsTitleDialogOpen(false);
        }}
      />
      <ChangeTagsDialog
        isOpen={isTagsDialogOpen}
        currentTags={editableData.tags}
        onSave={handleTagsDialogSave}
        onClose={() => {
          setIsTagsDialogOpen(false);
        }}
      />
      <ChangeEmojiDialog
        isOpen={isEmojiDialogOpen}
        currentEmoji={editableData?.emoji}
        onSave={handleEmojiDialogSave}
        onClose={() => {
          setIsEmojiDialogOpen(false);
        }}
      />
    </>
  );
};
