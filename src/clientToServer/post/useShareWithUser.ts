import { useMutation, useQueryClient } from "@tanstack/react-query";

import { shareWithUser } from "./shareWithUser";

export function useShareWithUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shareWithUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sharedUsers"] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Failed to share recipe book:", error.message);
      }
    },
  });
}
