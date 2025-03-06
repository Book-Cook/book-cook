import * as React from "react";
import { Textarea } from "@fluentui/react-components";
import { motion } from "framer-motion";
import { MarkdownParser, FallbackScreen } from "../..";
import { useRecipe } from "../../../context";
import { useStyles } from "./RecipeContent.styles";

export const RecipeContent = () => {
  const styles = useStyles();
  const {
    recipe,
    isLoading,
    error,
    isEditing,
    editableData,
    updateEditableData,
  } = useRecipe();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <FallbackScreen
        isLoading={isLoading}
        isError={Boolean(error)}
        dataLength={recipe?.data?.length}
      >
        {isEditing ? (
          <Textarea
            value={editableData.content}
            onChange={(e) => updateEditableData("content", e.target.value)}
            className={styles.contentTextarea}
            placeholder="Write your recipe content in markdown..."
            resize="vertical"
          />
        ) : (
          recipe?.data && (
            <div className={styles.recipeContent}>
              <MarkdownParser markdownInput={recipe.data} />
            </div>
          )
        )}
      </FallbackScreen>
    </motion.div>
  );
};
