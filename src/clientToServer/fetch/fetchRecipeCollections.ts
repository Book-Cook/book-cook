import { fetchJson } from "src/utils";
import type { Recipe } from "../types";

export const fetchRecipeCollections = async (): Promise<Recipe[]> => {
  try {
    return await fetchJson(`/api/user/collections`);
  } catch (error) {
    console.error("Failed to fetch recipe collections:", error);
    throw error;
  }
};
