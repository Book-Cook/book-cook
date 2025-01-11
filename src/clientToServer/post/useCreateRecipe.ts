import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Recipe, CreateRecipeResponse } from "../types";

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRecipe: Omit<Recipe, "_id" | "createdAt">) => {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload recipe");
      }
      return (await response.json()) as CreateRecipeResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Failed to upload recipe:", error.message);
      } else {
        console.error("Failed to upload recipe:", error);
      }
    },
  });
}
