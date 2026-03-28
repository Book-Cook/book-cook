import type { Recipe } from "../../components/RecipeView/RecipeView.types";

export const fetchRecentlyViewed = async (): Promise<Recipe[]> => {
  const response = await fetch("/api/recentlyViewed/");
  if (!response.ok) {
    return [];
  }
  return response.json();
};
