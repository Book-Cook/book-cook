import DOMPurify from "dompurify";

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

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching recipes: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    throw error;
  }
};
