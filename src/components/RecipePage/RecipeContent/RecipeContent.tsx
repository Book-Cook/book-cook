import * as React from "react";
import dynamic from "next/dynamic";

import { Spinner } from "@fluentui/react-components";

import { useRecipe } from "../../../context";
import { FadeIn } from "../../Animation";

const Editor = dynamic(() => import("../../Editor/Editor").then((mod) => ({ default: mod.Editor })), {
  loading: () => <div style={{ minHeight: "200px", padding: "16px", background: "#f5f5f5", borderRadius: "8px" }}>Loading editor...</div>,
  ssr: false,
});

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
