import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LexicalEditor } from "lexical";
import { useRouter } from "next/router";

import { ConfirmDialog } from "../ConfirmDialog";
import { LoadingScreen, ErrorScreen } from "../FallbackScreens";
import { RecipeSaveBar } from "../RecipeSaveBar";
import type { SaveBarStatus } from "../RecipeSaveBar/RecipeSaveBar.types";
import { RecipeView } from "../RecipeView";
import {
  RecipeViewSaveStateProvider,
  useRecipeViewSaveState,
} from "../RecipeView/RecipeViewSaveStateContext";
import { exportRecipeMarkdown } from "../TextEditor/textEditorConfig";

import { deleteRecipe, fetchRecipe } from "../../clientToServer";
import type { CreateRecipeResponse } from "../../clientToServer/types";
import { useUnsavedChangesGuard } from "../../hooks";

/**
 * Route id for a recipe that has not been saved yet. "New recipe" opens this
 * draft instead of inserting a blank document, so abandoning it leaves no
 * Untitled Recipe behind; the first Save creates the recipe.
 */
export const NEW_RECIPE_ID = "new";

const DEFAULT_EMOJI = "🍲";

type RecipePageInnerProps = {
  recipeId: string;
  onCancelReset: () => void;
  onCreated: (recipeId: string) => void;
  onDeleted: () => void;
};

function RecipePageInner({
  recipeId,
  onCancelReset,
  onCreated,
  onDeleted,
}: RecipePageInnerProps) {
  const isDraft = recipeId === NEW_RECIPE_ID;
  const editorRef = useRef<LexicalEditor | null>(null);
  const [status, setStatus] = useState<SaveBarStatus>("idle");
  const saveState = useRecipeViewSaveState();
  const queryClient = useQueryClient();
  const isDirty = saveState?.isDirty ?? false;
  const guard = useUnsavedChangesGuard({ enabled: isDirty });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const draftRecipe = useMemo(
    () => ({
      _id: "",
      title: "",
      data: "",
      tags: [],
      imageURL: "",
      emoji: DEFAULT_EMOJI,
      owner: "",
      isPublic: false,
      createdAt: new Date().toISOString(),
    }),
    [],
  );

  const {
    data: fetchedRecipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId),
    enabled: Boolean(recipeId) && !isDraft,
  });
  const recipe = isDraft ? draftRecipe : fetchedRecipe;

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      title,
      data,
      emoji,
      tags,
    }: {
      title: string;
      data: string;
      emoji: string;
      tags: string[];
    }): Promise<string> => {
      if (isDraft) {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            data,
            emoji,
            tags,
            imageURL: "",
            isPublic: false,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create recipe");
        }
        const created = (await response.json()) as CreateRecipeResponse;
        return created.recipeId;
      }
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, data, emoji, tags }),
      });
      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }
      return recipeId;
    },
  });

  const {
    mutate: removeRecipe,
    isPending: isDeleting,
    isError: deleteFailed,
  } = useMutation({
    mutationFn: () => deleteRecipe(recipeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      void queryClient.invalidateQueries({ queryKey: ["allTags"] });
      // Remount the save-state provider clean so the unsaved-changes guard
      // does not block leaving the deleted recipe.
      onCancelReset();
      onDeleted();
    },
  });

  if (isLoading && !isDraft) {
    return <LoadingScreen />;
  }
  if (error || !recipe) {
    return <ErrorScreen />;
  }

  const onSave = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const data = editor.read(exportRecipeMarkdown);
    const title = saveState?.getTitle() ?? recipe.title;
    const emoji = saveState?.getEmoji() ?? recipe.emoji;
    const tags = saveState?.getTags() ?? recipe.tags ?? [];

    setStatus("saving");
    mutateAsync({ title, data, emoji, tags })
      .then((savedId) => {
        // Update cache immediately so no second network round-trip is needed
        queryClient.setQueryData(
          ["recipe", savedId],
          (old: Record<string, unknown> | undefined) => ({
            ...(old ?? { ...recipe, _id: savedId }),
            title,
            data,
            emoji,
            tags,
          }),
        );
        void queryClient.invalidateQueries({
          queryKey: ["recipes"],
          refetchType: "none",
        });
        // Reset dirty state immediately by remounting the save state provider
        onCancelReset();
        if (isDraft) {
          onCreated(savedId);
          return;
        }
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 800);
      })
      .catch(() => setStatus("error"));
  };

  const onCancel = () => {
    guard.guardAction(() => {
      setStatus("idle");
      onCancelReset();
    });
  };

  return (
    <>
      <RecipeView recipe={recipe} viewingMode="editor" editorRef={editorRef} />
      <RecipeSaveBar
        status={status}
        onSave={onSave}
        onCancel={onCancel}
        onDelete={isDraft ? undefined : () => setIsDeleteDialogOpen(true)}
        isDeleting={isDeleting}
        deleteFailed={deleteFailed}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete this recipe?"
        description="This permanently removes the recipe. It cannot be undone."
        confirmLabel="Delete recipe"
        cancelLabel="Keep recipe"
        onConfirm={() => {
          setIsDeleteDialogOpen(false);
          removeRecipe();
        }}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
      <ConfirmDialog
        open={guard.isBlocked}
        onOpenChange={(open) => {
          if (!open) {
            guard.stay();
          }
        }}
        title="Discard unsaved changes?"
        description="Your edits have not been saved yet. They will be lost if you continue."
        cancelLabel="Keep editing"
        cancelVariant="primary"
        cancelPlacement="end"
        confirmLabel="Discard changes"
        onConfirm={guard.discard}
        onCancel={guard.stay}
      />
    </>
  );
}

export const RecipePage = () => {
  const router = useRouter();
  const recipeId = router.query.recipes as string;
  const [resetKey, setResetKey] = useState(0);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const isDraft = recipeId === NEW_RECIPE_ID;

  const { data: recipe } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId),
    enabled: Boolean(recipeId) && !isDraft,
  });

  // Move a just-saved draft onto its real URL. This runs after the save-state
  // provider has remounted clean, so the unsaved-changes guard is already off.
  useEffect(() => {
    if (!createdId) {
      return;
    }
    setCreatedId(null);
    void router.replace(`/recipes/${createdId}`);
  }, [createdId, router]);

  // Leave a just-deleted recipe once the save-state provider has remounted
  // clean, for the same reason as above.
  useEffect(() => {
    if (!isDeleted) {
      return;
    }
    setIsDeleted(false);
    void router.replace("/recipes");
  }, [isDeleted, router]);

  return (
    <RecipeViewSaveStateProvider
      key={`${recipeId}-${resetKey}`}
      initialTitle={recipe?.title ?? ""}
      initialData={recipe?.data ?? ""}
      initialEmoji={recipe?.emoji ?? DEFAULT_EMOJI}
      initialTags={recipe?.tags ?? []}
    >
      <RecipePageInner
        recipeId={recipeId}
        onCancelReset={() => setResetKey((k) => k + 1)}
        onCreated={setCreatedId}
        onDeleted={() => setIsDeleted(true)}
      />
    </RecipeViewSaveStateProvider>
  );
};
