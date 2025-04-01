import * as React from "react";
import { motion } from "framer-motion";
import { TiptapEditor } from "../../Editor/Editor";
import { useRecipe } from "../../../context";

export const RecipeContent = () => {
  const { isLoading, editableData, updateEditableData } = useRecipe();
  const oldContent = React.useRef(editableData?.content);

  const handleEditorChange = React.useCallback(
    (htmlContent: string) => {
      if (htmlContent !== oldContent.current) {
        oldContent.current = htmlContent;
        updateEditableData("content", htmlContent);
      }
    },
    [updateEditableData]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <TiptapEditor
        value={editableData?.content || ""}
        onChange={handleEditorChange}
        placeholder="Write your recipe content..."
        readOnly={isLoading}
      />
      {isLoading && <div>Loading...</div>}
    </motion.div>
  );
};
