import DOMPurify from "dompurify";

import { fetchJson } from "src/utils";
import type { Recipe } from "../types";

const sortOptions = {
  dateNewest: { property: "createdAt", direction: "desc" },
  dateOldest: { property: "createdAt", direction: "asc" },
  ascTitle: { property: "title", direction: "asc" },
  descTitle: { property: "title", direction: "desc" },
};

export const fetchAllRecipes = async (
  searchBoxValue: string,
  orderBy: string,
  selectedTags: string[]
): Promise<Recipe[]> => {
  const sanitized = DOMPurify.sanitize(searchBoxValue);

  // Default sort config with fallback
  const sortConfig =
    sortOptions[orderBy as keyof typeof sortOptions] || sortOptions.dateNewest;

  // Build the URL with search, sort, and tags parameters
  let url = `/api/recipes?search=${encodeURIComponent(sanitized)}&sortProperty=${encodeURIComponent(
    sortConfig.property
  )}&sortDirection=${encodeURIComponent(sortConfig.direction)}`;

  // Add tags parameters if any are selected
  if (selectedTags.length > 0) {
    const tagsParam = selectedTags
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join("&");
    url += `&${tagsParam}`;
  }

  console.log('🚀 fetchAllRecipes called with URL:', url);
  
  try {
    const result = await fetchJson(url);
    console.log('🚀 fetchAllRecipes result:', result);
    return result;
  } catch (error) {
    console.error("🚀 Failed to fetch recipes:", error);
    throw error;
  }
};
