import React, { useMemo } from "react";
import { Text, Input } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { useRecipe } from "../../../context";
import { RecipeHeaderActions } from "./RecipeHeaderActions";
import { useHeaderStyles } from "./RecipeHeader.styles";

export const RecipeHeader = () => {
  const styles = useHeaderStyles();
  const {
    recipe,
    editableData,
    updateEditableData,
    saveChanges,
    cancelEditing,
    deleteRecipe,
    addToCollection,
    hasEdits,
  } = useRecipe();

  const handleAddToCollection = () =>
    recipe?._id && addToCollection(recipe._id);

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

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className={styles.headerSection}
    >
      <div className={styles.titleRow}>
        <div className={styles.titleContainer}>
          <Input
            aria-label="Recipe title"
            placeholder="Recipe Title"
            value={editableData.title}
            onChange={(e) => updateEditableData("title", e.target.value)}
            className={styles.titleInput}
            size="large"
            appearance="filled-lighter"
          />
        </div>
        <RecipeHeaderActions
          onSave={saveChanges}
          onCancel={cancelEditing}
          onAddToCollection={handleAddToCollection}
          onDelete={deleteRecipe}
          hasEdits={hasEdits}
        />
      </div>

      {formattedDate && (
        <Text block italic className={styles.date}>
          Created: {formattedDate}
        </Text>
      )}
    </motion.div>
  );
};
