import type { Recipe } from "../types";

export const fetchAllRecipes = async (): Promise<Recipe[]> => {
  const response = await fetch(`/api/recipes`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
