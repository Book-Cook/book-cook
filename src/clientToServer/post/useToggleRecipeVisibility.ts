import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchJson } from "src/utils";

interface ToggleVisibilityResponse {
  success: boolean;
  message: string;
  isPublic: boolean;
}

interface ToggleVisibilityRequest {
  recipeId: string;
  isPublic: boolean;
}

export function useToggleRecipeVisibility() {
  const queryClient = useQueryClient();

  return useMutation<ToggleVisibilityResponse, Error, ToggleVisibilityRequest>({
    mutationFn: async ({ recipeId, isPublic }) => {
      if (!recipeId) {
        throw new Error("Recipe ID is required.");
      }

      try {
        return await fetchJson<ToggleVisibilityResponse>(
          `/api/recipes/${recipeId}/visibility`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPublic }),
          },
        );
      } catch (error) {
        throw new Error(`Failed to update recipe visibility: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    onSuccess: async (data, { recipeId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["recipes"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["recipe", recipeId],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["publicRecipes"],
          refetchType: "all",
        }),
      ]);
    },
  });
}
