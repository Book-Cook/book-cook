import { fetchJson } from "src/utils";
import type { Recipe } from "../types";

export const fetchRecipe = async (id: string): Promise<Recipe> => {
  return fetchJson(`/api/recipes/${encodeURIComponent(id)}`);
};
