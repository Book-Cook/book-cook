import { fetchJson } from "src/utils";

export const fetchAllTags = async (): Promise<string[]> => {
  try {
    return await fetchJson("/api/recipes/tags");
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};
