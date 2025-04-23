import DOMPurify from 'dompurify';

import type { Recipe } from "../types";

export const fetchRecipe = async (id: string): Promise<Recipe> => {
  const sanitized = DOMPurify.sanitize(id)
  const response = await fetch(`/api/recipes/${encodeURIComponent(sanitized)}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
