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

  const sortConfig =
    sortOptions[orderBy as keyof typeof sortOptions] || sortOptions.dateNewest;

  let url = `/api/recipes?search=${encodeURIComponent(sanitized)}&sortProperty=${encodeURIComponent(
    sortConfig.property
  )}&sortDirection=${encodeURIComponent(sortConfig.direction)}`;

  if (selectedTags.length > 0) {
    const tagsParam = selectedTags
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join("&");
    url += `&${tagsParam}`;
  }

  try {
    const result = await fetchJson(url);
    return result;
  } catch (error) {
    throw error;
  }
};
