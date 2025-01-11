import type { Recipe } from "../types";
import DOMPurify from "dompurify";

export const fetchAllRecipes = async (
  searchBoxValue: string,
  sortProperty: string,
  sortDirection: string
): Promise<Recipe[]> => {
  const sanitizedSearchBox = DOMPurify.sanitize(searchBoxValue);
  const sanitizedSortProp = DOMPurify.sanitize(sortProperty);
  const sanitizedSortDirection = DOMPurify.sanitize(sortDirection);
  const response = await fetch(
    `/api/recipes?search=${encodeURIComponent(sanitizedSearchBox)}&sortProperty=${encodeURIComponent(sanitizedSortProp)}&sortDirection=${encodeURIComponent(sanitizedSortDirection)}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
