import type { Recipe } from "../types";

export const fetchRecipeCollections = async (): Promise<Recipe[]> => {
  try {
    const response = await fetch(`/api/user/collections`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();

  } catch (error) {
    console.error("Failed to fetch recipe collections:", error);
    throw error;
  }
};
