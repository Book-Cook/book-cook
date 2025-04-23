import { useQuery } from "@tanstack/react-query";

import { fetchSharedUsers } from "./fetchSharedUsers";

export function useSharedUsers() {
  return useQuery({
    queryKey: ["sharedUsers"],
    queryFn: fetchSharedUsers,
  });
}
