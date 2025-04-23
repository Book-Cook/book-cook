export interface UserInfo {
  name?: string;
}

export async function fetchUser(userId?: string): Promise<UserInfo | null> {
  if (!userId) {
    return null;
  }

  try {
    const response = await fetch(
      `/api/users/lookup?userId=${encodeURIComponent(userId)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
