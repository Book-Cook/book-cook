import { fetchJson } from "src/utils";
import type { Recipe } from "../types";

export const fetchRecentlyViewed = async (): Promise<Recipe[]> => {
  return fetchJson(`/api/user/recentlyViewed`);
};
