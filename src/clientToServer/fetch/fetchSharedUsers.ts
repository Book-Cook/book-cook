export async function fetchSharedUsers(): Promise<string[]> {
  const response = await fetch("/api/user/sharing", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shared users");
  }

  const data = await response.json();
  return data.sharedWithUsers ?? [];
}
