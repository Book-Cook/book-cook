import * as React from "react";

import { Spinner } from "@fluentui/react-components";

import { useRecipe } from "../../../context";
import { FadeIn } from "../../Animation";
import { Editor } from "../../Editor/Editor";

export const RecipeContent = () => {
  const { isLoading, editableData, updateEditableDataKey, isAuthorized } =
    useRecipe();

  const handleEditorChange = React.useCallback(
    (htmlContent: string) => {
      updateEditableDataKey("content", htmlContent);
    },
    [updateEditableDataKey]
  );

  return (
    <FadeIn delay={0.6}>
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
    </FadeIn>
  );
};
