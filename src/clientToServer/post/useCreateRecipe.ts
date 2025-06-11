import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchJson } from "src/utils";
import type { UpdateRecipePayload, CreateRecipeResponse } from "../types";

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newRecipe: Omit<UpdateRecipePayload, "_id" | "createdAt">
    ) => {
      return fetchJson<CreateRecipeResponse>("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
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
