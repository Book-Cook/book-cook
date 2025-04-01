import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateRecipePayload = {
  title: string;
  data: string;
  tags: string[];
  imageURL: string;
};

/**
 * Hook to update a recipe via post request.
 * Invalidates the specific recipe query cache on success.
 *
 * @param recipeId The ID of the recipe to update.
 */
export function useUpdateRecipe(recipeId: string | string[] | undefined) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateRecipePayload>({
    mutationFn: async (updatedRecipeData) => {
      if (!recipeId) {
        throw new Error("Recipe ID required for update.");
      }

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecipeData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update recipe (Status: ${response.status})`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
  });
}
