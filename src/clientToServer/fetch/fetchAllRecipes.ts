import DOMPurify from "dompurify";

import { fetchJson } from "src/utils";
import type { Recipe } from "../types";

const sortOptions = {
  dateNewest: { property: "createdAt", direction: "desc" },
  dateOldest: { property: "createdAt", direction: "asc" },
  ascTitle: { property: "title", direction: "asc" },
  descTitle: { property: "title", direction: "desc" },
};

export interface RecipesResponse {
  recipes: Recipe[];
  totalCount: number;
  hasMore: boolean;
}

export interface FetchRecipesParams {
  searchBoxValue: string;
  orderBy: string;
  selectedTags?: string[];
  offset?: number;
  limit?: number;
}

export const fetchAllRecipes = async (
  searchBoxValue: string,
  orderBy: string,
  selectedTags: string[] = []
): Promise<Recipe[]> => {
  const response = await fetchRecipesPaginated({
    searchBoxValue,
    orderBy,
    selectedTags,
  });
  return response.recipes;
};

export const fetchRecipesPaginated = async ({
  searchBoxValue,
  orderBy,
  selectedTags = [],
  offset = 0,
  limit = 20,
}: FetchRecipesParams): Promise<RecipesResponse> => {
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

  url += `&offset=${offset}&limit=${limit}`;

  return fetchJson(url);
};
