import type { Recipe } from "../types";

export const fetchRecipe = async (id: string): Promise<Recipe> => {
  const response = await fetch(`/api/recipes/${id}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
