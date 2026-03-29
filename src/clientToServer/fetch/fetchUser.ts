import { fetchJson } from "src/utils";

export interface UserInfo {
  name?: string;
}

export async function fetchUser(userId?: string): Promise<UserInfo | null> {
  if (!userId) {
    return null;
  }

  try {
    return await fetchJson<UserInfo | null>(
      `/api/user/lookup?userId=${encodeURIComponent(userId)}`
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
