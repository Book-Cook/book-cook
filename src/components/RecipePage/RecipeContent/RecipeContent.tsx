import * as React from "react";
import { Spinner } from "@fluentui/react-components";
import dynamic from "next/dynamic";

import { useRecipe } from "../../../context";
import { FadeIn } from "../../Animation";

const Editor = dynamic(() => import("../../Editor/Editor").then(mod => ({ default: mod.Editor })), {
  loading: () => <Spinner label="Loading editor..." />,
  ssr: false
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
