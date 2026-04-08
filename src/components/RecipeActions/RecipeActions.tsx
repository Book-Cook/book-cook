import * as React from "react";
import {
  TrashIcon,
  DotsThreeIcon,
  TagIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";

import { useFetchAllTags } from "src/clientToServer";
import type { RecipeActionsProps } from "./RecipeActions.types";
import { useRecipeActions } from "./useRecipeActions";
import { Button } from "../Button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../Menu";
import { Tooltip } from "../Tooltip";

import { useRecipe } from "../../context";

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
  },
);

export const RecipeActions: React.FC<RecipeActionsProps> = (props) => {
  const { deleteRecipe } = useRecipe();
  const { availableTags } = useFetchAllTags();

  const {
    activeDialog,
    setActiveDialog,
    handleMenuInteraction,
    closeDialog,
    handleSave,
    handleVisibilitySave,
    editableData,
    isTogglingVisibility,
  } = useRecipeActions(props);

  // Use props if provided, otherwise fall back to editableData from context
  const isPublic = props.isPublic ?? editableData?.isPublic;

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
            onSelect={() => {
              setActiveDialog("isPublic");
            }}
          >
            Visibility
          </MenuItem>
          <MenuItem
            startIcon={<TagIcon />}
            onSelect={() => {
              setActiveDialog("tags");
            }}
          >
            Add Tags
          </MenuItem>
          <MenuSeparator />
          <MenuItem startIcon={<TrashIcon />} onSelect={() => deleteRecipe()}>
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
