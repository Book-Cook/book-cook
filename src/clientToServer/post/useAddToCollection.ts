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
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["collections"] });

      // Snapshot the previous value
      const previousCollections = queryClient.getQueryData(["collections"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["collections"], (old: any) => {
        if (!old) return old;
        
        // Check if recipe is already in collections
        const isInCollection = old.some((recipe: any) => recipe._id === recipeId);
        
        if (isInCollection) {
          // Remove from collection (toggle off)
          return old.filter((recipe: any) => recipe._id !== recipeId);
        } else {
          // We can't add it optimistically since we don't have the full recipe data
          // Just return the old data and let the success handler invalidate
          return old;
        }
      });

      // Return a context object with the snapshotted value
      return { previousCollections };
    },
    onError: (err, recipeId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["collections"], context?.previousCollections);
    },
    onSuccess: async () => {
      // Force immediate refetch to update UI - invalidate all related queries
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: ["collections"],
          refetchType: "all"
        }),
        queryClient.invalidateQueries({ 
          queryKey: ["recipeCollections"],
          refetchType: "all"
        }),
        // Also invalidate the main recipes query in case it shows collection status
        queryClient.invalidateQueries({ 
          queryKey: ["recipes"],
          refetchType: "all"
        }),
      ]);
    },
  });
}
