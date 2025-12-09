import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import type {
  RecipeContextType,
  EditableData,
} from "./RecipeProvider.types";
import {
  toEditableData,
  hasPendingEdits,
  buildUpdatePayload,
} from "./RecipeProvider.utils";

import {
  fetchRecipe,
  useDeleteRecipe,
  useAddToCollection,
  useUpdateRecipe,
} from "../../clientToServer";
import type { UpdateRecipePayload } from "../../clientToServer";
import { useSaveRecipe } from "../../clientToServer/post/useSaveRecipe";

export const RecipeContext = React.createContext<RecipeContextType | null>(
  null
);

/**
 * Encapsulates recipe fetching, edit state, and mutations for a single recipe page.
 * Keeps a saved snapshot (`savedData`) so UI elements like save bars react instantly.
 */
export const RecipeProvider: React.FC<{
  children: React.ReactNode;
  specificRecipeId?: string;
}> = ({ children, specificRecipeId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { recipes: routerRecipeId } = router.query;
  const recipeId =
    specificRecipeId ??
    (typeof routerRecipeId === "string" ? routerRecipeId : undefined);

  const [editableData, setEditableData] = React.useState<EditableData>(
    toEditableData()
  );
  const [savedData, setSavedData] = React.useState<EditableData | null>(null);

  const { mutate: deleteMutate } = useDeleteRecipe();
  const { mutate: addToCollection } = useAddToCollection();
  const { mutate: saveRecipe } = useSaveRecipe();
  const { mutate: updateRecipe } = useUpdateRecipe(
    recipeId ?? editableData._id
  );

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId as string),
    enabled: Boolean(recipeId),
  });

  const updateEditableData = React.useCallback(
    (patch: Partial<EditableData>) => {
      setEditableData((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  const handleAddTag = React.useCallback(
    (tag: string) => {
      if (tag.trim() !== "" && !editableData.tags.includes(tag.trim())) {
        setEditableData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag.trim()],
        }));
      }
    },
    [editableData.tags]
  );

  const handleRemoveTag = React.useCallback(
    (tagToRemove: string) => {
      setEditableData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove),
      }));
    },
    []
  );

  /**
   * Merges immediate updates into local state and fires the mutation.
   * Keeps savedData in sync so UI elements (save bar) react instantly.
   */
  const saveChanges = React.useCallback(
    (immediateUpdate?: Partial<UpdateRecipePayload>) => {
      if (immediateUpdate) {
        setEditableData((prev) => ({ ...prev, ...immediateUpdate }));
        setSavedData((prev) => ({ ...(prev ?? editableData), ...immediateUpdate }));
        updateRecipe(buildUpdatePayload(editableData, immediateUpdate));
      } else {
        setSavedData(editableData);
        updateRecipe(buildUpdatePayload(editableData));
      }
    },
    [editableData, setEditableData, setSavedData, updateRecipe]
  );

  const cancelEditing = React.useCallback(() => {
    if (savedData) {
      setEditableData(savedData);
    } else if (recipe) {
      const reset = toEditableData(recipe);
      setEditableData(reset);
      setSavedData(reset);
    }
  }, [recipe, savedData]);

  const deleteRecipe = React.useCallback(() => {
    const idToDelete = recipe?._id ?? editableData._id;

    if (idToDelete) {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        deleteMutate(idToDelete, {
          onSuccess: async () => {
            if (router.pathname.includes("/recipes/[recipes]")) {
              await router.push("/");
            }
          },
          onError: (error) => {
            if (error instanceof Error) {
              alert(`Failed to delete recipe: ${error.message}`);
            }
          },
        });
      }
    }
  }, [recipe, editableData._id, deleteMutate, router]);

  const onAddToCollection = React.useCallback(
    (recipeId: string) => {
      addToCollection(recipeId, {
        onSuccess: (_data) => {
          // Recipe successfully added/removed from collection
        },
        onError: (error) => {
          console.error("Failed to update collection:", error);
        },
      });
    },
    [addToCollection]
  );

  const onSaveRecipe = React.useCallback(
    (recipeId: string) => {
      saveRecipe(recipeId, {
        onSuccess: (_data) => {
          // Recipe saved/unsaved successfully
        },
        onError: (error) => {
          console.error("Failed to save recipe:", error);
        },
      });
    },
    [saveRecipe]
  );

  React.useEffect(() => {
    if (recipe) {
      const initialData = toEditableData(recipe);
      setEditableData(initialData);
      setSavedData(initialData);
    }
  }, [recipe]);

  const hasEdits = React.useMemo(() => {
    return hasPendingEdits(editableData, savedData);
  }, [editableData, savedData]);

  const isAuthorized = React.useMemo(() => {
    if (!recipe || !session?.user?.email) {
      return false;
    }
    return true;
  }, [recipe, session]);

  const contextValue = React.useMemo(
    () => ({
      recipe,
      isLoading,
      isAuthorized,
      error,
      editableData,
      updateEditableData,
      handleAddTag,
      handleRemoveTag,
      saveChanges,
      cancelEditing,
      deleteRecipe,
      onAddToCollection,
      onSaveRecipe,
      hasEdits,
    }),
    [
      recipe,
      isLoading,
      isAuthorized,
      error,
      editableData,
      updateEditableData,
      handleAddTag,
      handleRemoveTag,
      saveChanges,
      cancelEditing,
      deleteRecipe,
      onAddToCollection,
      onSaveRecipe,
      hasEdits,
    ]
  );

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => {
  const context = React.useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};
