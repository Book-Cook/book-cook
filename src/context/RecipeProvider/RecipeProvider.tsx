import * as React from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRecipe, useDeleteRecipe } from "../../clientToServer";
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
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = useDeleteRecipe();

  const [isEditing, setIsEditing] = React.useState(false);

  const [editableData, setEditableData] = React.useState({
    title: "",
    content: "",
    tags: [] as string[],
    imageURL: "",
  });

  const [hasEdits, setHasEdits] = React.useState(false); // New state

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => fetchRecipe(recipeId as string),
    enabled: !!recipeId,
  });

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (updatedRecipe: any) => {
      const response = await fetch(`/api/recipes/${recipe?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Failed to update recipe: ${error.message}`);
      }
    },
  });

  // Initialize editable data when recipe changes
  React.useEffect(() => {
    if (recipe) {
      const initialData = {
        title: recipe.title || "",
        content: recipe.data || "",
        tags: recipe.tags || [],
        imageURL: recipe.imageURL || "",
      };
      setEditableData(initialData);
      setHasEdits(false);
    }
  }, [recipe]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEditableData = (field: string, value: any) => {
    setEditableData((prev) => {
      const updatedData = { ...prev, [field]: value };
      // Compare updated data with original recipe data
      if (recipe) {
        const originalData = {
          title: recipe.title || "",
          content: recipe.data || "",
          tags: recipe.tags || [],
          imageURL: recipe.imageURL || "",
        };

        setHasEdits(!isEqual(updatedData, originalData));
      }
      return updatedData;
    });
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

    updateMutation.mutate({
      title: editableData.title,
      data: editableData.content,
      tags: editableData.tags,
      imageURL: editableData.imageURL,
    });

    setHasEdits(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    if (recipe) {
      const initialData = {
        title: recipe.title || "",
        content: recipe.data || "",
        tags: recipe.tags || [],
        imageURL: recipe.imageURL || "",
      };
      setEditableData(initialData);
      setHasEdits(false); // Reset hasEdits when canceling
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

  const handleImageUpload = () => {
    // In a real app, upload to storage service and get URL
    alert("In a real app, this would upload the image to storage");
    updateEditableData("imageURL", "");
  };

  const addToCollectionMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      const response = await fetch(`/api/collections/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add recipe to collection");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Failed to add recipe to collection: ${error.message}`);
      }
    },
  });

  const addToCollection = async (recipeId: string) => {
    await addToCollectionMutation.mutate(recipeId);
  };

  const contextValue = {
    recipe,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    editableData,
    updateEditableData,
    handleAddTag,
    handleRemoveTag,
    saveChanges,
    cancelEditing,
    deleteRecipe,
    handleImageUpload,
    addToCollection,
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
