import * as React from "react";
import dynamic from "next/dynamic";

import { useRecipe } from "../../../context";
import { FadeIn } from "../../Animation";
import { Spinner } from "../../Spinner";

const Editor = dynamic(() => import("../../Editor/Editor").then(mod => ({ default: mod.Editor })), {
  loading: () => <Spinner label="Loading editor..." />,
  ssr: false
});

const RecipeContentComponent = () => {
  const { isLoading, editableData, updateEditableData, isAuthorized } =
    useRecipe();

  const handleEditorChange = React.useCallback(
    (htmlContent: string) => {
      updateEditableData({ content: htmlContent });
    },
    [updateEditableData]
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

export const RecipeContent = React.memo(RecipeContentComponent);
