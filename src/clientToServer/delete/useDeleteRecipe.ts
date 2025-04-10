import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRecipe } from "./deleteRecipe";

export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Failed to delete recipe:", error.message);
      }
    },
  });
}
