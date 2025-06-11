import { useMutation, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";

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

      const sanitizedData = {
        title: DOMPurify.sanitize(String(updatedRecipeData.title || "")),
        data: DOMPurify.sanitize(String(updatedRecipeData.data || "")),
        tags: Array.isArray(updatedRecipeData.tags)
          ? updatedRecipeData.tags.map((tag) => DOMPurify.sanitize(String(tag)))
          : [],
        imageURL: DOMPurify.sanitize(String(updatedRecipeData.imageURL || "")),
        emoji: DOMPurify.sanitize(String(updatedRecipeData.emoji || "")),
        isPublic: Boolean(updatedRecipeData.isPublic),
      };

      try {
        return await fetchJson(`/api/recipes/${recipeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedData),
        });
      } catch (error) {
        return error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["allTags"] });
    },
  });
}
