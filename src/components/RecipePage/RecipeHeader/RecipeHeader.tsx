import React, { useMemo } from "react";
import { Text } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { useRecipe } from "../../../context";
import { RecipeHeaderActions } from "./RecipeHeaderActions";
import { useHeaderStyles } from "./RecipeHeader.styles";
import { RecipeHeaderSaveBar } from "./RecipeHeaderSaveBar";
import { ChangeTitleDialog } from "./ChangeTitleDialog";
import { ChangeTagsDialog } from "./ChangeTagsDialog";
import { ChangeEmojiDialog } from "./ChangeEmojiDialog";

export const RecipeHeader = () => {
  const [isTitleDialogOpen, setIsTitleDialogOpen] = React.useState(false);
  const [isTagsDialogOpen, setIsTagsDialogOpen] = React.useState(false);
  const [isEmojiDialogOpen, setIsEmojiDialogOpen] = React.useState(false);

  const styles = useHeaderStyles();
  const {
    recipe,
    editableData,
    saveChanges,
    cancelEditing,
    deleteRecipe,
    onAddToCollection,
    hasEdits,
  } = useRecipe();

  const handleAddToCollection = () =>
    recipe?._id && onAddToCollection(recipe._id);

  const formattedDate = useMemo(() => {
    const date = recipe?.createdAt ? new Date(recipe.createdAt) : null;
    if (!date || isNaN(date.getTime())) {
      return null;
    }
    try {
      return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [recipe?.createdAt]);

  const handleTitleDialogSave = (newTitle: string) => {
    saveChanges({ title: newTitle });
    setIsTitleDialogOpen(false);
  };

  const handleTagsDialogSave = (updatedTags: string[]) => {
    console.log("Updated tags:", updatedTags);
    saveChanges({ tags: updatedTags });
    setIsTagsDialogOpen(false);
  };

  const handleEmojiDialogSave = (updatedEmoji: string) => {
    saveChanges({ emoji: updatedEmoji });
    setIsEmojiDialogOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={styles.headerSection}
      >
        <div className={styles.titleRow}>
          <div className={styles.titleContainer}>{editableData.title}</div>
          <RecipeHeaderActions
            onAddToCollection={handleAddToCollection}
            onDelete={deleteRecipe}
            onChangeTitle={() => {
              setIsTitleDialogOpen(true);
            }}
            onChangeEmoji={() => {
              setIsEmojiDialogOpen(true);
            }}
            onAddTags={() => {
              setIsTagsDialogOpen(true);
            }}
          />
        </div>
        <RecipeHeaderSaveBar
          hasEdits={hasEdits}
          onSave={saveChanges}
          onCancel={cancelEditing}
        />
        {formattedDate && (
          <Text block italic className={styles.date}>
            Created: {formattedDate}
          </Text>
        )}
      </motion.div>
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
          setIsTagsDialogOpen(false);
        }}
      />
    </>
  );
};
