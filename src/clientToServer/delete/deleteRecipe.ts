export async function deleteRecipe(
  id: string
): Promise<{ message: string; recipeId: string }> {
  const response = await fetch(`/api/recipes/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete recipe");
  }

  return response.json();
}
