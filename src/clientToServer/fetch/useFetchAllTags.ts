import { useQuery } from "@tanstack/react-query";

import { fetchAllTags } from "./fetchAllTags";

export function useFetchAllTags() {
  const { data: availableTags = [], isLoading: isTagsLoading } = useQuery({
    queryKey: ["allTags"],
    queryFn: fetchAllTags,
  });

  return { availableTags, isTagsLoading };
}
