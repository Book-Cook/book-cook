export async function deleteSharedUser(
  shareWithEmail: string
): Promise<{ message: string }> {
  const response = await fetch("/api/recipes/share", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shareWithEmail }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to remove access");
  }

  return data;
}
