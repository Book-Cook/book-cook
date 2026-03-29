import { fetchJson } from "src/utils";

export async function deleteRecipe(
  id: string
): Promise<{ message: string; recipeId: string }> {
  return fetchJson(`/api/recipes/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
