import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddToCollectionResponse {
  success: boolean;
  message?: string;
  updatedCollection?: { id: string; name: string };
}

interface ApiErrorResponse {
  message: string;
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

      const response = await fetch("/api/users/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        let errorInfo = `Status: ${response.status} ${response.statusText}`;

        const errorData = (await response?.json()) as ApiErrorResponse;
        errorInfo = errorData.message || errorInfo;

        throw new Error(`Failed to add recipe to collection: ${errorInfo}`);
      }

      return (await response.json()) as AddToCollectionResponse;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
}
