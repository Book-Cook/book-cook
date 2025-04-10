import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import isEqual from "lodash/isEqual";
import { useRouter } from "next/router";

import type { RecipeContextType, EditableData } from "./RecipeProvider.types";

import {
  fetchRecipe,
  useDeleteRecipe,
  useAddToCollection,
  useUpdateRecipe,
} from "../../clientToServer";
import type { UpdateRecipePayload } from "../../clientToServer";

export const RecipeContext = React.createContext<RecipeContextType | null>(
  null
);

export const RecipeProvider: React.FC<{
  children: React.ReactNode;
  specificRecipeId?: string;
}> = ({ children, specificRecipeId }) => {
  const router = useRouter();
  const { recipes: routerRecipeId } = router.query;
  const recipeId =
    specificRecipeId ??
    (typeof routerRecipeId === "string" ? routerRecipeId : undefined);

  const [editableData, setEditableData] = React.useState<EditableData>({
    title: "",
    content: "",
    tags: [] as string[],
    imageURL: "",
    emoji: "",
    _id: undefined,
  });

  const { mutate: deleteMutate } = useDeleteRecipe();
  const { mutate: addToCollection } = useAddToCollection();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEditableDataKey = (field: string, value: any) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEditableData = (value: any) => {
    setEditableData(value);
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() !== "" && !editableData.tags.includes(tag.trim())) {
      updateEditableDataKey("tags", [...editableData.tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateEditableDataKey(
      "tags",
      editableData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const saveChanges = (immediateUpdate?: Partial<UpdateRecipePayload>) => {
    if (immediateUpdate) {
      updateRecipe({
        ...{
          title: editableData?.title as string,
          data: editableData?.content as string,
          tags: editableData?.tags as string[],
          imageURL: editableData?.imageURL as string,
          emoji: editableData?.emoji as string,
        },
        ...(immediateUpdate || {}),
      });
    } else {
      updateRecipe({
        title: editableData.title,
        data: editableData.content,
        tags: editableData.tags,
        imageURL: editableData.imageURL,
        emoji: editableData?.emoji,
      });
    }
  };

  const cancelEditing = () => {
    if (recipe) {
      const initialData = {
        title: recipe.title || "",
        content: recipe.data || "",
        tags: recipe.tags || [],
        imageURL: recipe.imageURL || "",
        emoji: recipe.emoji || "",
      };
      setEditableData(initialData);
    }
  };

  const deleteRecipe = () => {
    const idToDelete = recipe?._id ?? editableData._id;

    if (idToDelete) {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        deleteMutate(idToDelete, {
          onSuccess: () => {
            if (router.pathname.includes("/recipes/[recipes]")) {
              router.push("/");
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
  };

  const onAddToCollection = async (recipeId: string) => {
    await addToCollection(recipeId);
  };

  React.useEffect(() => {
    if (recipe) {
      const initialData = {
        title: recipe.title || "",
        content: recipe.data || "",
        tags: recipe.tags || [],
        imageURL: recipe.imageURL || "",
        emoji: recipe.emoji || "",
      };
      setEditableData(initialData);
    }
  }, [recipe]);

  const initialEditableData = React.useMemo(() => {
    if (!recipe) {
      return null;
    }
    return {
      title: recipe.title || "",
      content: recipe.data || "",
      tags: recipe.tags || [],
      imageURL: recipe.imageURL || "",
      emoji: recipe.emoji || "",
    };
  }, [recipe]);

  const hasEdits = React.useMemo(() => {
    if (!initialEditableData) {
      return false;
    }
    return !isEqual(editableData, initialEditableData);
  }, [editableData, initialEditableData]);

  const contextValue = {
    recipe,
    isLoading,
    error,
    editableData,
    updateEditableDataKey,
    updateEditableData,
    handleAddTag,
    handleRemoveTag,
    saveChanges,
    cancelEditing,
    deleteRecipe,
    onAddToCollection,
    hasEdits,
  };

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
