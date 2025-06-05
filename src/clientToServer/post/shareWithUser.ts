export async function shareWithUser(
  shareWithEmail: string
): Promise<{ message: string }> {
  const response = await fetch("/api/user/sharing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shareWithEmail }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to share recipe book");
  }

  return data;
}
