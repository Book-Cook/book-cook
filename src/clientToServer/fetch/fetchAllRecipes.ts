import type { Recipe } from "../types";
import DOMPurify from "dompurify";

const sortOptions = {
  dateNewest: { property: "createdAt", direction: "desc" },
  dateOldest: { property: "createdAt", direction: "asc" },
  ascTitle: { property: "title", direction: "asc" },
  descTitle: { property: "title", direction: "desc" },
};

export const fetchAllRecipes = async (
  searchBoxValue: string,
  orderBy: string
): Promise<Recipe[]> => {
  const sanitized = DOMPurify.sanitize(searchBoxValue);

  // Default sort config with fallback
  const sortConfig =
    sortOptions[orderBy as keyof typeof sortOptions] || sortOptions.dateNewest;

  try {
    const response = await fetch(
      `/api/recipes?search=${encodeURIComponent(sanitized)}&sortProperty=${encodeURIComponent(
        sortConfig.property
      )}&sortDirection=${encodeURIComponent(sortConfig.direction)}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching recipes: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    throw error;
  }
};
