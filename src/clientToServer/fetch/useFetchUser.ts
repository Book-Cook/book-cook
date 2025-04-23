import { useQuery } from "@tanstack/react-query";

import { fetchUser } from "./fetchUser";

/**
 * Fetches user data based on the provided userId.
 *
 * This only fetches the user name.
 */
export function useFetchUser(userId?: string) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => (userId ? fetchUser(userId) : null),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    isLoading,
    error,
    displayName: user?.name,
  };
}
