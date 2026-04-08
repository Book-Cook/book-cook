import { type Dispatch, type SetStateAction, useState } from "react";

export const sortLabelMap: Record<string, string> = {
  createdAt: "Newest",
  savedCount: "Most Saved",
  viewCount: "Most Viewed",
  title: "Title",
};

export const availableTags = [
  "breakfast",
  "lunch",
  "dinner",
  "dessert",
  "snack",
  "vegetarian",
  "vegan",
  "gluten-free",
  "healthy",
  "quick",
  "easy",
  "comfort-food",
  "italian",
  "mexican",
  "asian",
];

interface UseDiscoverFiltersReturn {
  search: string;
  setSearch: (value: string) => void;
  selectedTags: string[];
  sortBy: string;
  setSortBy: (value: string) => void;
  sortDirection: string;
  setSortDirection: Dispatch<SetStateAction<string>>;
  handleTagSelect: (tag: string) => void;
  sortLabelMap: Record<string, string>;
  availableTags: string[];
}

/**
 * Manages search, tag filter, and sort state for the discover page.
 */
export function useDiscoverFilters(): UseDiscoverFiltersReturn {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return {
    search,
    setSearch,
    selectedTags,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    handleTagSelect,
    sortLabelMap,
    availableTags,
  };
}
