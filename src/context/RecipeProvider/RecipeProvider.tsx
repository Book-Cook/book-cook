import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import isEqual from "fast-deep-equal";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import type { RecipeContextType, EditableData } from "./RecipeProvider.types";

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

  const [editableData, setEditableData] = React.useState<EditableData>({
    title: "",
    content: "",
    tags: [] as string[],
    imageURL: "",
    emoji: "",
    _id: undefined,
    isPublic: false,
  });

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
          title: editableData?.title,
          data: editableData?.content,
          tags: editableData?.tags,
          imageURL: editableData?.imageURL,
          emoji: editableData?.emoji,
          isPublic: editableData?.isPublic ?? false,
        },
        ...(immediateUpdate || {}),
      });
    } else {
      updateRecipe({
        title: editableData.title,
        data: editableData.content,
        tags: editableData.tags,
        imageURL: editableData.imageURL,
        emoji: editableData?.emoji || "",
        isPublic: editableData.isPublic ?? false,
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
        isPublic: recipe.isPublic ?? false,
        _id: recipe._id,
      };
      setEditableData(initialData);
    }
  };

  const deleteRecipe = () => {
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
  };

  const onAddToCollection = (recipeId: string) => {
    addToCollection(recipeId, {
      onSuccess: (_data) => {
        // Recipe successfully added/removed from collection
      },
      onError: (error) => {
        console.error("Failed to update collection:", error);
      },
    });
  };

  const onSaveRecipe = (recipeId: string) => {
    saveRecipe(recipeId, {
      onSuccess: (_data) => {
        // Recipe saved/unsaved successfully
      },
      onError: (error) => {
        console.error("Failed to save recipe:", error);
      },
    });
  };

  React.useEffect(() => {
    if (recipe) {
      const initialData = {
        title: recipe.title || "",
        content: recipe.data || "",
        tags: recipe.tags || [],
        imageURL: recipe.imageURL || "",
        emoji: recipe.emoji || "",
        isPublic: recipe.isPublic ?? false,
        _id: recipe._id,
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
      isPublic: recipe.isPublic ?? false,
      _id: recipe._id,
    };
  }, [recipe]);

  const hasEdits = React.useMemo(() => {
    if (!initialEditableData) {
      return false;
    }
    return !isEqual(editableData, initialEditableData);
  }, [editableData, initialEditableData]);

  const isAuthorized = React.useMemo(() => {
    if (!recipe || !session?.user?.email) {
      return false;
    }
    return true;
  }, [recipe, session]);

  const contextValue = {
    recipe,
    isLoading,
    isAuthorized,
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
    onSaveRecipe,
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
