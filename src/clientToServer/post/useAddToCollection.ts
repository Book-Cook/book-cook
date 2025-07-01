import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchJson } from "src/utils";

interface AddToCollectionResponse {
  success: boolean;
  action: "added" | "removed";
  message?: string;
}

/**
 * Custom hook for adding a recipe to a collection via API mutation.
 * Invalidates 'collections' query on success.
 */
export function useAddToCollection() {
  const queryClient = useQueryClient();

  return useMutation<AddToCollectionResponse, Error, string>({
    mutationFn: async (recipeId: string) => {
      if (!recipeId) {
        throw new Error("Recipe ID is required.");
      }

      try {
        return await fetchJson<AddToCollectionResponse>(
          "/api/user/collections",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipeId }),
          }
        );
      } catch (error) {
        let errorInfo = "";
        if (error instanceof Error) {
          errorInfo = error.message;
        }
        throw new Error(`Failed to add recipe to collection: ${errorInfo}`);
      }
    },
    onMutate: async (recipeId: string) => {
      await queryClient.cancelQueries({ queryKey: ["collections"] });
      const previousCollections = queryClient.getQueryData(["collections"]);

      queryClient.setQueryData(["collections"], (old: unknown) => {
        if (!old) {
          return old;
        }
        const recipes = old as Array<{ _id: string }>;
        const isInCollection = recipes.some((recipe) => recipe._id === recipeId);
        return isInCollection 
          ? recipes.filter((recipe) => recipe._id !== recipeId)
          : recipes;
      });

      return { previousCollections };
    },
    onError: (err, recipeId, context) => {
      if (context && typeof context === 'object' && 'previousCollections' in context) {
        queryClient.setQueryData(["collections"], context.previousCollections);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["collections"], refetchType: "all" }),
        queryClient.invalidateQueries({ queryKey: ["recipeCollections"], refetchType: "all" }),
        queryClient.invalidateQueries({ queryKey: ["recipes"], refetchType: "all" }),
      ]);
    },
  });
}
