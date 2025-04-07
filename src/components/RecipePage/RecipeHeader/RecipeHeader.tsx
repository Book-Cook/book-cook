import React, { useMemo } from "react";
import { Button, Tooltip, Text } from "@fluentui/react-components";
import { Heart20Regular, SparkleRegular } from "@fluentui/react-icons";
import { motion } from "framer-motion";
import { useRecipe } from "../../../context";
import { RecipeActions } from "../../RecipeActions";
import { useHeaderStyles } from "./RecipeHeader.styles";
import { RecipeHeaderSaveBar } from "./RecipeHeaderSaveBar";
import { useConvertMeasurements } from "../../../clientToServer";

export const RecipeHeader = () => {
  const styles = useHeaderStyles();
  const {
    recipe,
    editableData,
    updateEditableDataKey,
    saveChanges,
    cancelEditing,
    hasEdits,
    onAddToCollection,
  } = useRecipe();

  const {
    mutate: convertRecipeContent,
    isPending: isConverting,
    reset: resetConversionState,
  } = useConvertMeasurements();

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

  const handleAiConvert = () => {
    if (isConverting || !editableData?.content) {
      return; // Don't run if already converting or no content
    }

    resetConversionState(); // Clear previous errors/data from hook state

    console.log("Triggering AI conversion..."); // Debug log

    convertRecipeContent(
      { htmlContent: editableData.content },
      {
        onSuccess: (data) => {
          console.log("AI conversion successful.");
          console.log(data.processedContent);
          updateEditableDataKey("content", data.processedContent);
        },
        onError: (error) => {
          console.error("AI conversion error:", error);
        },
      }
    );
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
          <div className={styles.actionsContainer}>
            <Tooltip content="Convert Measurements (AI)" relationship="label">
              <Button
                aria-label="Convert Measurements using AI"
                appearance="transparent"
                icon={<SparkleRegular />}
                shape="circular"
                onClick={handleAiConvert}
                disabled={isConverting || !editableData?.content}
              />
            </Tooltip>
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
