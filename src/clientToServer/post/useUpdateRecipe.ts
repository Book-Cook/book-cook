import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchJson } from "src/utils";
import type { UpdateRecipePayload } from "../types";

/**
 * Hook to update a recipe via post request.
 * Invalidates the specific recipe query cache on success.
 *
 * @param recipeId The ID of the recipe to update.
 */
export function useUpdateRecipe(recipeId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateRecipePayload>({
    mutationFn: async (updatedRecipeData) => {
      if (!recipeId) {
        throw new Error("Recipe ID required for update.");
      }

      const payload = {
        title: String(updatedRecipeData.title ?? ""),
        data: String(updatedRecipeData.data ?? ""),
        tags: Array.isArray(updatedRecipeData.tags)
          ? updatedRecipeData.tags.map((tag) => String(tag))
          : [],
        imageURL: String(updatedRecipeData.imageURL ?? ""),
        emoji: String(updatedRecipeData.emoji ?? ""),
        isPublic: Boolean(updatedRecipeData.isPublic),
      };

      try {
        return await fetchJson(`/api/recipes/${recipeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        return error;
      }
    },
    onSuccess: async () => {
      // Ensure any queries that include the "recipe" or "recipes" keys
      // are fully refetched (including paginated or parameterized variants).
      // Using refetchType: "all" forces active and inactive queries to refetch
      // which prevents stale cache showing old titles in the gallery.
      await queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["recipes"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["allTags"],
        refetchType: "all",
      });
    },
  });
}
