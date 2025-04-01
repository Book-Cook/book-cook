import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRecipe,
  useDeleteRecipe,
  useAddToCollection,
  useUpdateRecipe,
} from "../../clientToServer";
import { RecipeContextType } from "./RecipeProvider.types";
import { isEqual } from "lodash";

export const RecipeContext = React.createContext<RecipeContextType | null>(
  null
);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { recipes: recipeId } = router.query;
  const { mutate: deleteMutate } = useDeleteRecipe();
  const { mutate: addToCollection } = useAddToCollection();
  const { mutate: updateRecipe } = useUpdateRecipe(recipeId);

  const [editableData, setEditableData] = React.useState({
    title: "",
    content: "",
    tags: [] as string[],
    imageURL: "",
  });

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId as string),
    enabled: !!recipeId,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEditableData = (field: string, value: any) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() !== "" && !editableData.tags.includes(tag.trim())) {
      updateEditableData("tags", [...editableData.tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateEditableData(
      "tags",
      editableData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const saveChanges = () => {
    if (!editableData.title.trim() || !editableData.content.trim()) {
      alert("Title and content are required");
      return;
    }

    updateRecipe({
      title: editableData.title,
      data: editableData.content,
      tags: editableData.tags,
      imageURL: editableData.imageURL,
    });
  };

  const cancelEditing = () => {
    if (recipe) {
      const initialData = {
        title: recipe.title || "",
        content: recipe.data || "",
        tags: recipe.tags || [],
        imageURL: recipe.imageURL || "",
      };
      setEditableData(initialData);
    }
  };

  const deleteRecipe = () => {
    if (recipe?._id) {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        deleteMutate(recipe._id, {
          onSuccess: () => {
            router.push(`/`);
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
    };
  }, [recipe]);

  const hasEdits = React.useMemo(() => {
    if (!initialEditableData) {
      return false;
    }
    console.log(JSON.stringify(editableData) + "editable");
    console.log(JSON.stringify(initialEditableData) + "inital");
    return !isEqual(editableData, initialEditableData);
  }, [editableData, initialEditableData]);

  const contextValue = {
    recipe,
    isLoading,
    error,
    editableData,
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
