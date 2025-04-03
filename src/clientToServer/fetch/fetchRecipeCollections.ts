import type { Recipe } from "../types";

export const fetchRecipeCollections = async (): Promise<Recipe[]> => {
  const response = await fetch(`/api/collections`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
