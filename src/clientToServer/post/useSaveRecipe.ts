import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchJson } from "src/utils";

interface SaveRecipeResponse {
  success: boolean;
  action: "saved" | "unsaved";
  message: string;
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();

  return useMutation<SaveRecipeResponse, Error, string>({
    mutationFn: async (recipeId: string) => {
      if (!recipeId) {
        throw new Error("Recipe ID is required.");
      }

      try {
        return await fetchJson<SaveRecipeResponse>(
          "/api/user/saved-recipes",
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
        throw new Error(`Failed to save recipe: ${errorInfo}`);
      }
    },
    onMutate: async (recipeId: string) => {
      await queryClient.cancelQueries({ queryKey: ["savedRecipes"] });
      await queryClient.cancelQueries({ queryKey: ["publicRecipes"] });
      
      const previousSavedRecipes = queryClient.getQueryData(["savedRecipes"]);

      queryClient.setQueryData(["savedRecipes"], (old: unknown) => {
        if (!old) {return old;}
        const recipes = old as Array<{ _id: string }>;
        const isAlreadySaved = recipes.some((recipe) => recipe._id === recipeId);
        
        return isAlreadySaved 
          ? recipes.filter((recipe) => recipe._id !== recipeId)
          : recipes;
      });

      return { previousSavedRecipes };
    },
    onError: (err, recipeId, context) => {
      if (context && typeof context === 'object' && 'previousSavedRecipes' in context) {
        queryClient.setQueryData(["savedRecipes"], context.previousSavedRecipes);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["savedRecipes"], refetchType: "all" }),
        queryClient.invalidateQueries({ queryKey: ["publicRecipes"], refetchType: "all" }),
        queryClient.invalidateQueries({ queryKey: ["collections"], refetchType: "all" }),
      ]);
    },
  });
}