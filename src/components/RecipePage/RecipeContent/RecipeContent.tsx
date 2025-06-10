import * as React from "react";
import { motion } from "framer-motion";
import { Spinner } from "@fluentui/react-components";

import { useRecipe } from "../../../context";
import { Editor } from "../../Editor/Editor";

export const RecipeContent = () => {
  const { isLoading, editableData, updateEditableDataKey, isAuthorized } = useRecipe();

  const handleEditorChange = React.useCallback(
    (htmlContent: string) => {
      updateEditableDataKey("content", htmlContent);
    },
    [updateEditableDataKey]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {!isLoading && isAuthorized ? (
        <Editor
          value={editableData?.content || ""}
          onChange={handleEditorChange}
          placeholder="Write your recipe content..."
          readOnly={isLoading}
        />
      ) : null}
      {isLoading && <Spinner label="Loading recipe..." />}
      {!isLoading && !isAuthorized && (
        <div>You are not authorized to view this recipe</div>
      )}
    </motion.div>
  );
};
