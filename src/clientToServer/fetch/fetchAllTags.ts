import { fetchJson } from "src/utils";

export const fetchAllTags = async (): Promise<string[]> => {
  return fetchJson("/api/recipes/tags");
};
