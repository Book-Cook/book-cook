import React, { useMemo } from "react";
import { Button, Tooltip, Text } from "@fluentui/react-components";
import { Heart20Regular } from "@fluentui/react-icons";
import { motion } from "framer-motion";
import { useRecipe } from "../../../context";
import { RecipeActions } from "../../RecipeActions";
import { useHeaderStyles } from "./RecipeHeader.styles";
import { RecipeHeaderSaveBar } from "./RecipeHeaderSaveBar";

export const RecipeHeader = () => {
  const styles = useHeaderStyles();
  const {
    recipe,
    editableData,
    saveChanges,
    cancelEditing,
    hasEdits,
    onAddToCollection,
  } = useRecipe();

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

  const handleAddToCollection = () =>
    recipe?._id && onAddToCollection(recipe._id);

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
          <div className={styles.actionsContainer}>
            <Tooltip content="Add to Collection" relationship="label">
              <Button
                aria-label="Add to Collection"
                appearance="transparent"
                icon={<Heart20Regular />}
                shape="circular"
                onClick={handleAddToCollection}
                className={styles.favoriteButton}
              />
            </Tooltip>
            <RecipeActions />
          </div>
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
    </>
  );
};
