import type { Recipe } from "../types";
import DOMPurify from 'dompurify';

export const fetchAllRecipes = async (searchBoxValue: string): Promise<Recipe[]> => {
  const sanitized = DOMPurify.sanitize(searchBoxValue)
  const response = await fetch(`/api/recipes?search=${encodeURIComponent(sanitized)}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
