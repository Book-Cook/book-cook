import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSharedUser } from "./deleteSharedUser";

export function useDeleteSharedUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSharedUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sharedUsers"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Failed to remove access:", error.message);
      }
    },
  });
}
