import * as React from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { $convertToMarkdownString } from "@lexical/markdown";
import type { LexicalEditor } from "lexical";

import { fetchRecipe } from "../../clientToServer";
import { RecipeView } from "../RecipeView";
import { RecipeViewSaveStateProvider, useRecipeViewSaveState } from "../RecipeView/RecipeViewSaveStateContext";
import { RecipeSaveBar } from "../RecipeSaveBar";
import type { SaveBarStatus } from "../RecipeSaveBar/RecipeSaveBar.types";
import { LoadingScreen, ErrorScreen } from "../FallbackScreens";
import { recipeTransformers } from "../TextEditor/textEditorConfig";

type RecipePageInnerProps = {
  recipeId: string;
  onCancelReset: () => void;
};

function RecipePageInner({ recipeId, onCancelReset }: RecipePageInnerProps) {
  const editorRef = useRef<LexicalEditor | null>(null);
  const [status, setStatus] = useState<SaveBarStatus>("idle");
  const saveState = useRecipeViewSaveState();
  const queryClient = useQueryClient();

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId),
    enabled: !!recipeId,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title, data, emoji, tags }: { title: string; data: string; emoji: string; tags: string[] }) => {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, data, emoji, tags }),
      });
      if (!response.ok) throw new Error("Failed to update recipe");
      return response.json();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error || !recipe) return <ErrorScreen />;

  const onSave = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const data = editor.read(() => $convertToMarkdownString(recipeTransformers));
    const title = saveState?.getTitle() ?? recipe.title;
    const emoji = saveState?.getEmoji() ?? recipe.emoji;
    const tags = saveState?.getTags() ?? recipe.tags ?? [];

    setStatus("saving");
    mutateAsync({ title, data, emoji, tags })
      .then(() => {
        // Update cache immediately so no second network round-trip is needed
        queryClient.setQueryData(["recipe", recipeId], (old: any) => ({
          ...old,
          title,
          data,
          emoji,
          tags,
        }));
        // Reset dirty state immediately by remounting the save state provider
        onCancelReset();
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 800);
      })
      .catch(() => setStatus("error"));
  };

  const onCancel = () => {
    setStatus("idle");
    onCancelReset();
  };

  return (
    <>
      <RecipeView
        recipe={recipe}
        viewingMode="editor"
        editorRef={editorRef}
      />
      <RecipeSaveBar status={status} onSave={onSave} onCancel={onCancel} />
    </>
  );
}

export const RecipePage = () => {
  const router = useRouter();
  const recipeId = router.query.recipes as string;
  const [resetKey, setResetKey] = useState(0);

  const { data: recipe } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId),
    enabled: !!recipeId,
  });

  return (
    <RecipeViewSaveStateProvider
      key={resetKey}
      initialTitle={recipe?.title ?? ""}
      initialData={recipe?.data ?? ""}
      initialEmoji={recipe?.emoji ?? "🍲"}
      initialTags={recipe?.tags ?? []}
    >
      <RecipePageInner
        recipeId={recipeId}
        onCancelReset={() => setResetKey((k) => k + 1)}
      />
    </RecipeViewSaveStateProvider>
  );
};
