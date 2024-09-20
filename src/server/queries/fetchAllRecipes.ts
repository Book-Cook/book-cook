import type { Recipe } from "../types";

export const fetchAllRecipes = async (searchBoxValue: string): Promise<Recipe[]> => {
  const response = await fetch(`/api/recipes?title=${searchBoxValue}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
