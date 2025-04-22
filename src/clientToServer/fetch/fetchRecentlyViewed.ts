import type { Recipe } from "../types";

export const fetchRecentlyViewed = async () : Promise<Recipe[]> => {
  const response = await fetch(`/api/user/recentlyViewed`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
