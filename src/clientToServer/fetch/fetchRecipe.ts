import DOMPurify from 'dompurify';
import { fetchJson } from "src/utils";

import type { Recipe } from "../types";

export const fetchRecipe = async (id: string): Promise<Recipe> => {
  const sanitized = DOMPurify.sanitize(id);
  return fetchJson(`/api/recipes/${encodeURIComponent(sanitized)}`);
};
