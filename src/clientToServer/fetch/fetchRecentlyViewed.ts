import type { Recipe } from "../types";
import { fetchJson } from "src/utils";

export const fetchRecentlyViewed = async (): Promise<Recipe[]> => {
  return fetchJson(`/api/user/recentlyViewed`);
};
